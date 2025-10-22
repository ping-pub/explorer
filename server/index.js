const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const workerPool = require('./services/worker');
const transactionService = require('./services/transactionService');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API endpoints
app.get('/api/v1/transactions', async (req, res) => {
  try {
    const { page, limit, chain } = req.query;
    const transactions = await transactionService.getTransactions({
      page,
      limit,
      chain,
    });
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/transactions/count', async (req, res) => {
  try {
    const { chain } = req.query;
    const count = await transactionService.getTransactionCount(chain);
    res.json(count);
  } catch (error) {
    console.error('Error fetching transaction count:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/v1/transactions/:transaction_id', async (req, res) => {
  try {
    const { transaction_id } = req.params;
    const { chain } = req.query;
    const transaction = await transactionService.getTransactionById(
      transaction_id,
      chain
    );

    if (!transaction.data) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ error: error.message });
  }
});

// Temporary Staking Endpoint (to avoid 501 error)
app.get('/api/v1/staking/self-bonded', async (req, res) => {
  try {
    // Dummy response (until real logic added)
    res.json({
      validator: 'validator_address_example',
      selfBonded: '1000000000',
      denom: 'upokt',
      status: 'active',
    });
  } catch (error) {
    console.error('Error fetching self-bonded info:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to get chain statistics
app.get('/api/v1/chains/stats', async (req, res) => {
  try {
    const stats = await transactionService.getChainStats();
    res.json(stats);
  } catch (error) {
    console.error('Error fetching chain statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to get available chains
app.get('/api/v1/chains', (req, res) => {
  try {
    const chains = transactionService.getAvailableChains();
    res.json({ data: chains });
  } catch (error) {
    console.error('Error fetching chains:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server and initialize the worker pool
const startServer = async () => {
  try {
    // Initialize worker pool
    await workerPool.initialize();

    // Start the HTTP server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await workerPool.shutdown();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Shutting down server...');
      await workerPool.shutdown();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();
