const express = require('express');
const fs = require('fs');
const path = require('path');
const { mean } = require('../utils/stats');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../../data/items.json');

let cachedStats = null;
let cacheTimestamp = null;
const CACHE_DURATION = 60000; // 1 minute

// Watch for file changes to invalidate cache
fs.watchFile(DATA_PATH, () => {
  cachedStats = null;
  cacheTimestamp = null;
});

// GET /api/stats
router.get('/', (req, res, next) => {
  const now = Date.now();
  if (cachedStats && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return res.json(cachedStats);
  }

  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);

    const items = JSON.parse(raw);
    // Use utility function for mean calculation
    const stats = {
      total: items.length,
      averagePrice: mean(items.map(item => item.price))
    };

    cachedStats = stats;
    cacheTimestamp = now;
    res.json(stats);
  });
});

module.exports = router;
