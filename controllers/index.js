const server = require('../services/serverRecon');
const models = require('../models');

const token = '';
const link = '';

module.exports = {
    main: (req, res) => {
        if (req.body.password === process.env.PASSWORD) {
            server.join(token, link).then(joined => {
                models.Server.findOrCreate({
                    where: {
                        serverID : joined.guild.id
                    },
                    defaults: {
                        link: joined.code,
                        name: joined.guild.name,
                        parsed: true
                    }
                }).spread((guild, created) => {
                    server.users(token, joined.guild.id).then(users => {
                        models.User.bulkCreate(users, {
                            updateOnDuplicate: ["userID"],
                            returning: true
                        }).then((users) => {
                            users = users.map(userIDs => {
                                return ({
                                user_id: userIDs["userID"],
                                server_id: joined.guild.id
                                })
                            });
                            models.User_Server.bulkCreate(users, {
                                updateOnDuplicate: ["user_id", "server_id", "updatedAt"]
                            }).then(() => {
                               //res.status(200).json({'beautiful':'everything worked'})
                            });
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
                    }).catch(err => {
                        res.status(500).send(err);
                    })
                }).catch(err => {
                    console.log(err)
                });
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
                models.User_Server.findAll({
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
        let UID = ""; let SIDS = [];
        models.User.findOne({
        where: { userID: req.body.userID } // TODO : Also search for req.body.PSEUDO
        }).then(user => {
            UID = user.userID;
            return models.User_Server.findAll({
                where: {user_id: UID}
            })
        }).then((servers) => {
            servers.forEach(serv => {
                SIDS.push(serv.server_id);
            });
            return models.Server.findAll({
                where: {serverID: SIDS}
            })
        }).then(guild => {
            const connect = (index) => {
                server.join(token, guild[index].link).then(joined => {
                    server.profile(token, UID).then(profile => {
                        models.User.update( profile.update , { where: { userID: UID }})
                    }).catch(err => {
                        // TODO MAKE A NICE ERROR HANDLER
                    })
                }).catch(err => {
                    index < guild.length ? connect(++index) : console.log("No available server for this user");
                })
            };
            connect(0);
        }).then(() => {
            // SEND RESPONSE TO CLIENT
        }).catch(err => {
            res.status(500).json({'error':''});
        });
    }
};