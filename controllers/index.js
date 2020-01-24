const server = require('../services/serverRecon');
const models = require('../models');

const token = '';
const link = '';

module.exports = {
    main: (req, res) => {
        console.log(req.body);
        if (req.body.password === process.env.PASSWORD) {
            server.join(token,link).then(joined => {
                server.users(token, joined.guild.id).then(users => {
                    models.User.bulkCreate(users).then(() => {
                        // create users
                    })
                }).catch(() => {
                    res.status(500).send('cannot get list member');
                });
                server.inspect(token, joined.guild.id).then(chans => {
                    chans.forEach(chan => {
                        chan.forEach(message => {
                            console.table(message);
                        });
                    });
                }).catch(() => {
                    res.status(500).send('cannot search messages');
                })
            }).catch(err => {
                res.status(500).send('invalid link');
            });
        }
        else {
            res.status(403).json({'error':'UNAUTHORIZED'})
        }
    },
    serverInfo : (req, res) => {
        if (req.body.link || req.body.serverID)
        {
            models.Server.findOne({
            $or: [
                { link: req.body.link },
                { serverID: req.body.serverID }
            ]
            }).then((server) => {
                models.User_Servers.findAll({
                    where: {
                        server_id: server.id
                    }
                }).then((users) => {
                    return users
                }).catch((err) => {
                    res.status(500).json({'error':'could not request users'})
                })
            }).catch((err) => {
                res.status(500).json({'error':'could not request server'})
            })
        }
        else {
            res.status(400).json({'error':'bad request'})
        }
    },
    userInfo : (req, res) => {
        models.User.findOne({
            //TODO: Later bitches
        })
    }
};