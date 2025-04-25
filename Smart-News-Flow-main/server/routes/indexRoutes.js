const express = require('express');
const router = express.Router();
const { streamData } = require('../controllers/streamController');
const { dataSync } = require('../controllers/dataSyncController');
const { search } = require('../controllers/searchController');
const { checkRelevance } = require('../controllers/langchainController')

router.get('/', (_req, res) => {
  console.log("Server started");
  res.send('Hello, World!');
});

router.post('/search', search);

router.post('/data-sync', dataSync);

router.get('/stream', streamData);

router.post('/refine', async (req, res) => {
  const { prompt, content } = req.body;
  let attempt = 0;
const maxRetries = 3;
let success = false;

while (attempt < maxRetries && !success) {
  try {
    const relevance = await checkRelevance(prompt, content);
    res.json(relevance);
    success = true; // Exit loop if successful
  } catch (error) {
    attempt++;
    console.error(`Attempt ${attempt} - Error checking relevance:`, error);
    if (attempt >= maxRetries) {
      res.status(500).send('Internal Server Error');
    }
  }
}
});

module.exports = router;
