const server = require('../services/serverRecon');
const finder = require('../services/serverFinder');
const tokens = require('../services/tokens');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    finder.bruteforce().then(guild => {
        console.log(guild.link); //
        finder.save(guild.link).then(created => {
            console.log(created)
        }).catch(err => {
            console.log(err)
        })
    })
});

router.get('/new/:id', (req, res) => {
    tokens.add(req.params.id).then(response => {
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json(err)
    });
});

router.get('', (req, res) => {

});

module.exports = router;