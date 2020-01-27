const server = require('../services/serverRecon');
const tokens = require('../services/tokens');
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
                                updateOnDuplicate: ["user_id", "server_id"]
                            }).then(() => {
                               //res.status(200).json({'beautiful':'everything worked'})
                            });
                        })
                    }).catch(() => {
                        res.status(500).send('cannot get list member');
                    });
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
        let token;
        tokens.get().then(res => {
            console.log(res);
        });
        if (req.body.link) {
            server.join(token, req.body.link).then(joined => {
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
                    if (!created){
                        guild.link = joined.code;
                        guild.name = joined.guild.name;
                        guild.save();
                    }
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
                                updateOnDuplicate: ["user_id", "server_id"]
                            }).then(() => {
                                console.info('yiks')
                            });
                        })
                    }).catch(() => {
                        res.status(500).send('cannot get list member');
                    });
                    // server.inspect(token, joined.guild.id).then(chans => {
                    //     chans.forEach(chan => {
                    //         chan.forEach(message => {
                    //             EDUCATIONAL PURPOSE ONLY!
                    //         });
                    //     });
                    // }).catch(err => {
                    //     res.status(500).send(err);
                    // })
                }).catch(err => {
                    console.error(err + ' in ServerInfo()')
                });
                console.info('Server ' + joined.guild.name + ' has been saved to database.' )
            }).catch(err => {
                res.status(500).send('Invalid link');
            });
        }
        else if (req.body.serverID) {
            models.Server.findOne({
                where: { serverID: req.body.serverID }
            }).then((server) => {
                return models.User_Server.findAll({
                    where: {
                        server_id: server.serverID
                    },
                    attributes: {
                        exclude: ['id', 'server_id', 'createdAt', 'updatedAt']
                    }
                })
            }).then((users) => {
                const userArray = [];
                users.forEach(user => {
                    userArray.push(user.user_id);
                });
                return models.User.findAll({
                    where: {userID : userArray},
                    attributes: ['userID','pseudo','avatar']
                });
            }).then(response => {
                res.status(200).json({ 'users': response })
            }).catch((err) => {
                res.status(500).send('Could not find this server ID. Try with a link.')
            })
        }
        else {
            res.status(400).json({'error':'bad request'})
        }
    },
    userInfo : (req, res) => {
        let UID = ""; let SIDS = [];
        const searchParams = {};
        if (req.body.userID)
            searchParams.userID = req.body.userID;
        else if (req.body.pseudo)
            searchParams.pseudo = req.body.pseudo;
        else
            res.status(400).send('missing parameter');
        models.User.findOne({ where: searchParams }).then(user => {
            UID = user.userID;
            return models.User_Server.findAll({
                where: { user_id: UID }
            })
        }).then((servers) => {
            servers.forEach(serv => {
                SIDS.push(serv.server_id);
            });
            return models.Server.findAll({
                where: { serverID: SIDS }
            })
        }).then(guild => {
            const connect = (index) => {
                server.join(token, guild[index].link).then(joined => {
                    server.profile(token, UID).then(profile => {
                        models.User.update( profile.update , { where: { userID: UID }})
                    }).catch(err => {
                        console.warn(err)
                    })
                }).catch(err => {
                    index < guild.length - 1 ?
                        connect(++index) :
                        console.warn('Could not join any server');
                })
            };
            connect(0);
        }).then(() => {
            return models.User.findOne({
               where: { userID: UID },
                attributes: {
                   exclude: ['id', 'createdAt', 'updatedAt']
                }
           })
        }).then(response => {
            res.send(response)
        }).catch(err => {
            res.status(400).send('could not find this user');
        });
    }
};