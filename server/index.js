const express = require('express');
const bodyParser = require('body-parser');
const Datastore = require('@seald-io/nedb')
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001; // Use a different port than Vite
const { sha256 } = require('@cosmjs/crypto');
const { toHex, toBase64 } = require('@cosmjs/encoding');
const { StargateClient } = require('@cosmjs/stargate');

app.use(bodyParser.json());

function hashTx(raw) {
  // Convert JSON object to string
  const jsonString = JSON.stringify(raw);

  // Convert string to Uint8Array
  const encoder = new TextEncoder();
  const uint8Array = encoder.encode(jsonString);
  return toHex(sha256(jsonString)).toUpperCase();
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
  const {transaction_id} = req.params
  const docs = await db.findAsync({_id: transaction_id})
  const totalCount = await db.countAsync({})

  res.json({
    data: docs
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

async function fetchLatestBlock() {
  let lbRes = await fetch('https://testnet-validated-validator-api.poktroll.com/cosmos/base/tendermint/v1beta1/blocks/latest');
  let latestBlock = await lbRes.json()
  console.log(latestBlock.block.header.height)
  return latestBlock
}

async function fetchTxByBlock(height) {
  let lbRes = await fetch(`https://testnet-validated-validator-api.poktroll.com/cosmos/tx/v1beta1/txs/block/${height}`);
  let blockDetails = await lbRes.json()
  return blockDetails;
}
// Fetch all data for transactions and dump in db
fetchLatestBlock().then(async data => {
  let latestBlockInDB = await db.findAsync({}, { height: 1 }).limit(1).sort({ height: -1 })
  if ((parseInt(latestBlockInDB[0]?.height) || 0) < parseInt(data.block.header.height)) {
    for (let i = parseInt(data.block.header.height); i > (parseInt(latestBlockInDB[0]?.height) || 0); i--) {
      let res = await fetchTxByBlock(i).then(async data => {
        let transactions = data.txs.map(tx => ({...tx,height:i}))
        console.log(i, transactions)
        let txs = await db.insertAsync(transactions)
        return txs
      })
      // console.log(res)
    }
  }
})

async function getHash(txObject){
        // Create a client to interact with the Cosmos blockchain
        const client = await StargateClient.connect('https://testnet-validated-validator-rpc.poktroll.com');
        // Encode the transaction object
        const encodedTx = Uint8Array.from(txObject);
        // Compute the transaction hash (the ID)
        // const txHash = StargateClient.computeTxHash(encodedTx);
        // console.log(`Transaction Hash: ${txHash}`);
        return encodedTx
}