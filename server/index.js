const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('@seald-io/nedb')
const { fromBase64 } = require('@cosmjs/encoding');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3005; // Use a different port than Vite
const { sha256 } = require('@cosmjs/crypto');
const { toHex, toBase64 } = require('@cosmjs/encoding');
const { StargateClient } = require('@cosmjs/stargate');
const { decodeTxRaw } = require('@cosmjs/proto-signing');
var CronJob = require("cron").CronJob;

app.use(bodyParser.json());
function hashTx(raw) {
  return toHex(sha256(raw)).toUpperCase();
}

async function createFileIfNotExists(filePath, content) {
  try {
    // Check if the file exists
    fs.accessSync(filePath);
    console.log(`File ${filePath} already exists.`);
  } catch (error) {
    // File does not exist, create it
    try {
      fs.writeFileSync(filePath, content);
      console.log(`File ${filePath} created.`);
    } catch (error) {
      console.error(`Error creating file ${filePath}:`, error);
    }
  }
}

function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
    console.log(`Directory ${directory} created.`);
  } else {
    console.log(`Directory ${directory} already exists.`);
  }
}

// Example usage
const dirPath = path.join(__dirname, 'datastore');
ensureDirectoryExists(dirPath);

const filePath = path.join(dirPath, 'pokt.db');
createFileIfNotExists(filePath, '');
//database intializations
const db = new Datastore({ filename: filePath, autoload: true })

// GET transactions
app.get('/api/v1/transactions', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  const pageNumber = parseInt(page, 10);
  const limitNumber = parseInt(limit, 10);

  const startIndex = (pageNumber - 1) * limitNumber;
  const endIndex = startIndex + limitNumber;
  const docs = await db.findAsync({}).skip(startIndex).limit(limitNumber).sort({ height: -1 })
  const totalCount = await db.countAsync({})
  // const paginatedTransactions = transactions.slice(startIndex, endIndex);

  res.json({
    data: docs,
    meta: {
      total: totalCount,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(totalCount / limitNumber),
    },
  });
});

app.get('/api/v1/transactions/count', async (req, res) => {
  const totalCount = await db.countAsync({})
  res.json({
    data: totalCount
  });
});

// GET transactions
app.get('/api/v1/transactions/:transaction_id', async (req, res) => {
  const { transaction_id } = req.params
  const docs = await db.findAsync({ _id: transaction_id })
  const totalCount = await db.countAsync({})

  res.json({
    data: docs
  });
});

var latestBlockHeight = '1'
async function fetchLatestBlock() {
  let lbRes = await fetch(`${process.env.rpc_endpoint || 'https://shannon-testnet-grove-api.beta.poktroll.com'}/cosmos/base/tendermint/v1beta1/blocks/latest`);
  let latestBlock = await lbRes.json();
  console.log(latestBlock.block.header.height);
  latestBlockHeight = latestBlock.block.header.height;
  return latestBlock;
}

async function processTransactions(data, height) {
  let transactions = [];
  for (const tx of data.block.data.txs) {
    console.log('.');
    const txHash = hashTx(fromBase64(tx));
    
    // Check if transaction already exists in the database
    const existingTx = await db.findAsync({ hash: txHash });
    if (existingTx && existingTx.length > 0) {
      console.log(`Transaction ${txHash} already exists, skipping`);
      continue;
    }
    
    let txRes = await fetchTx(txHash);
    transactions.push({
      status: txRes.tx_response.code,
      timestamp: txRes.tx_response.timestamp,
      messages: { ...decodeTxRaw(fromBase64(tx)) }.body.messages,
      fee: { ...decodeTxRaw(fromBase64(tx)) }.authInfo.fee,
      hash: txHash,
      height: height
    });
  }
  return transactions;
}

async function fetchAndStoreTransactions() {
  try {
    const data = await fetchLatestBlock();
    for (let i = parseInt(data.block.header.height); i > 0; i--) {
      let blockData = await fetchTxByBlock(i);
      let transactions = await processTransactions(blockData, i);
      if (transactions.length > 0) {
        console.log(`Inserting ${transactions.length} new transactions from block ${i}`);
        await db.insertAsync(transactions);
      }
    }
  } catch (e) {
    console.error("Error Trace :", e);
  }
}

async function fetchTx(hash) {
  let lbRes = await fetch((process.env.rpc_endpoint || 'https://shannon-testnet-grove-api.beta.poktroll.com') + `/cosmos/tx/v1beta1/txs/${hash}`);
  let tx = await lbRes.json()
  return tx
}

async function fetchTxByBlock(height) {
  let lbRes = await fetch((process.env.rpc_endpoint || 'https://shannon-testnet-grove-api.beta.poktroll.com') + `/cosmos/base/tendermint/v1beta1/blocks/${height}`);
  let blockDetails = await lbRes.json()
  return blockDetails;
}

var lastProcessedBlock = latestBlockHeight
var job = new CronJob(
  "*/30 * * * * *",
  async function () {
    try {
      let data = await fetchLatestBlock()
      if (lastProcessedBlock != data.block.header.height) {
        let res = await fetchTxByBlock(lastProcessedBlock).then(async data => {
          let transactions = []
          for (const tx of data.block.data.txs) {
            const txHash = hashTx(fromBase64(tx))
            
            // Check if transaction already exists in the database
            const existingTx = await db.findAsync({ hash: txHash })
            if (existingTx && existingTx.length > 0) {
              console.log(`Transaction ${txHash} already exists, skipping`)
              continue
            }
            
            let txRes = await fetchTx(txHash)
            transactions.push({
              status: txRes.tx_response.code,
              timestamp: txRes.tx_response.timestamp,
              messages: { ...decodeTxRaw(fromBase64(tx)) }.body.messages,
              fee: { ...decodeTxRaw(fromBase64(tx)) }.authInfo.fee,
              hash: txHash,
              height: data.block.header.height
            })
          }
          
          if (transactions.length > 0) {
            console.log(`Inserting ${transactions.length} new transactions from block ${data.block.header.height}`)
            let txs = await db.insertAsync(transactions)
            return txs
          }
          return []
        })
        lastProcessedBlock = data.block.header.height
      } else {
        fetchLatestBlock().then(async data => {
          let transactions = []
          for (const tx of data.block.data.txs) {
            const txHash = hashTx(fromBase64(tx))
            
            // Check if transaction already exists in the database
            const existingTx = await db.findAsync({ hash: txHash })
            if (existingTx && existingTx.length > 0) {
              console.log(`Transaction ${txHash} already exists, skipping`)
              continue
            }
            
            let txRes = await fetchTx(txHash)
            transactions.push({
              status: txRes.tx_response.code,
              timestamp: txRes.tx_response.timestamp,
              messages: { ...decodeTxRaw(fromBase64(tx)) }.body.messages,
              fee: { ...decodeTxRaw(fromBase64(tx)) }.authInfo.fee,
              hash: txHash,
              height: data.block.header.height
            })
          }
          
          if (transactions.length > 0) {
            console.log(`Inserting ${transactions.length} new transactions from latest block ${data.block.header.height}`)
            let txs = await db.insertAsync(transactions)
            return txs
          }
          return []
        })
      }
    } catch (e) {
      console.error("Error Trace :", e)
    }
  },
  null,
  true,
  "America/Los_Angeles"
);
job.start();
console.log(process.env.rpc_endpoint);

// Add this function to clean up duplicate transactions
async function cleanupDuplicateTransactions() {
  console.log("Starting duplicate transaction cleanup...");
  
  try {
    // Get all transactions
    const allTxs = await db.findAsync({});
    console.log(`Found ${allTxs.length} total transactions in database`);
    
    // Create a map to track unique transactions by hash
    const uniqueTxs = new Map();
    const duplicates = [];
    
    // Identify duplicates (keep the first occurrence of each hash)
    allTxs.forEach(tx => {
      if (!uniqueTxs.has(tx.hash)) {
        uniqueTxs.set(tx.hash, tx);
      } else {
        duplicates.push(tx._id);
      }
    });
    
    // Remove duplicates if any found
    if (duplicates.length > 0) {
      console.log(`Found ${duplicates.length} duplicate transactions to remove`);
      
      // Remove each duplicate
      for (const id of duplicates) {
        await db.removeAsync({ _id: id });
      }
      
      console.log(`Successfully removed ${duplicates.length} duplicate transactions`);
    } else {
      console.log("No duplicate transactions found");
    }
    
    // Compact the database to reclaim space
    await db.compactDatafileAsync();
    console.log("Database compacted after cleanup");
    
  } catch (error) {
    console.error("Error during duplicate transaction cleanup:", error);
  }
}

// Call the cleanup function before starting the server
cleanupDuplicateTransactions().then(() => {
  // Start the server after cleanup is complete
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
  
  // Then start fetching transactions
  fetchAndStoreTransactions();
});