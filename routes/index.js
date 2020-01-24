// const finder = require('../services/serverFinder');
// const tokens = require('../services/tokens');
const controller = require('../controllers/index');
const express = require('express');
const router = express.Router();


router.post('/', controller.main);
router.post('/user-info', controller.userInfo);
router.post('/server-info', controller.serverInfo);

router.get('/new/:id', (req, res) => {
    tokens.add(req.params.id).then(response => {
        res.status(200).json(response)
    }).catch(err => {
        res.status(500).json(err)
    });
});

module.exports = router;