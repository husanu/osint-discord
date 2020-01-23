const server = require('../services/serverRecon');
const finder = require('../services/serverFinder');
const tokens = require('../services/tokens');
const express = require('express');
const router = express.Router();

const token = '';
const link = '';

router.get('/', (req, res) => {
    server.join(token,link).then(joined => {
        server.users(token, joined.guild.id).then(users => {
            console.table(users);
        }).catch(() => {
            console.error('cannot get list member');
        });
        server.inspect(token, joined.guild.id).then(chans => {
            chans.forEach(chan => {
                chan.forEach(message => {
                    console.table(message);
                });
            });
        }).catch(() => {
            console.error('cannot search messages');
        })
    }).catch(err => {
        console.error('invalid link');
    });
});

router.get('/new/:id', (req, res) => {
    tokens.add(req.params.id).then(response => {
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;