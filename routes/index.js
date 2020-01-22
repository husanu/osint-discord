const server = require('../services/serverRecon');
const finder = require('../services/serverFinder');
const tokens = require('../services/tokens');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200)
});

router.get('/new/:id', (req, res) => {
    tokens.add(req.params.id).then(response => {
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;