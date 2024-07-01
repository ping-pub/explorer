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


// GET transactions
app.get('/api/v1/transactions/:transaction_id', async (req, res) => {
  const { transaction_id } = req.params
  const docs = await db.findAsync({ _id: transaction_id })
  const totalCount = await db.countAsync({})

  res.json({
    data: docs
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
var latestBlockHeight = '1'
async function fetchLatestBlock() {
  let lbRes = await fetch('https://testnet-validated-validator-api.poktroll.com/cosmos/base/tendermint/v1beta1/blocks/latest');
  let latestBlock = await lbRes.json()
  console.log(latestBlock.block.header.height)
  latestBlockHeight = latestBlock.block.header.height
  return latestBlock
}
async function fetchTx(hash) {
  let lbRes = await fetch('https://testnet-validated-validator-api.poktroll.com/cosmos/tx/v1beta1/txs/' + hash);
  let tx = await lbRes.json()
  return tx
}

async function fetchTxByBlock(height) {
  let lbRes = await fetch(`https://testnet-validated-validator-api.poktroll.com/cosmos/base/tendermint/v1beta1/blocks/${height}`);
  let blockDetails = await lbRes.json()
  return blockDetails;
}

// Fetch all data for transactions and dump in db
try {
  fetchLatestBlock().then(async data => {
    let latestBlockInDB = await db.findAsync({}).limit(1).sort({ height: -1 })
    if ((parseInt(latestBlockInDB[0]?.height) || 0) < parseInt(data.block.header.height)) {
      for (let i = parseInt(data.block.header.height); i > (parseInt(latestBlockInDB[0]?.height) || 0); i--) {
        let res = await fetchTxByBlock(i).then(async data => {
          let transactions = []
          for (tx of data.block.data.txs) {
            console.log('.')
            let txRes = await fetchTx(hashTx(fromBase64(tx)))
            transactions.push({
              status: txRes.tx_response.code,
              timestamp: txRes.tx_response.timestamp,
              messages: { ...decodeTxRaw(fromBase64(tx)) }.body.messages,
              fee: { ...decodeTxRaw(fromBase64(tx)) }.authInfo.fee,
              hash: hashTx(fromBase64(tx)),
              height: i
            })
          }
          transactions.filter((async tx => {
            let txRes = await db.findAsync({}, { hash: tx.hash }).limit(1).sort({ height: -1 })
            if (txRes.length > 0) {
              return false
            }
            return true
          }))
          if (transactions.length > 0) {
            console.log(`Inserting Transactions`, transactions)
          }
          let txs = await db.insertAsync(transactions)
          return txs
        })
      }
    }
  })
} catch (e) {
  console.error("Error Trace :", e)
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
          for (tx of data.block.data.txs) {
            let txRes = await fetchTx(hashTx(fromBase64(tx)))
            transactions.push({
              status: txRes.tx_response.code,
              timestamp: txRes.tx_response.timestamp,
              messages: { ...decodeTxRaw(fromBase64(tx)) }.body.messages,
              fee: { ...decodeTxRaw(fromBase64(tx)) }.authInfo.fee,
              hash: hashTx(fromBase64(tx)),
              height: data.block.header.height
            })
          }
          transactions.filter((async tx => {
            let txRes = await db.findAsync({}, { hash: tx.hash }).limit(1).sort({ height: -1 })
            if (txRes.length > 0) {
              return false
            }
            return true
          }))
          if (transactions.length > 0) {
            console.log(`Inserting Transactions`, transactions)
          }
          let txs = await db.insertAsync(transactions)
          return txs
        })
        lastProcessedBlock = data.block.header.height
      } else {
        fetchLatestBlock().then(async data => {
          let transactions = []
          for (tx of data.block.data.txs) {
            let txRes = await fetchTx(hashTx(fromBase64(tx)))
            transactions.push({
              status: txRes.tx_response.code,
              timestamp: txRes.tx_response.timestamp,
              messages: { ...decodeTxRaw(fromBase64(tx)) }.body.messages,
              fee: { ...decodeTxRaw(fromBase64(tx)) }.authInfo.fee,
              hash: hashTx(fromBase64(tx)),
              height: data.block.header.height
            })
          }
          transactions.filter((async tx => {
            let txRes = await db.findAsync({}, { hash: tx.hash }).limit(1).sort({ height: -1 })
            if (txRes.length > 0) {
              return false
            }
            return true
          }))
          if (transactions.length > 0) {
            console.log(`Inserting Transactions`, transactions)
          }
          let txs = await db.insertAsync(transactions)
          return txs


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
