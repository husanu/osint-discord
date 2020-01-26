const analyser = require('../utils/analyser');
const axios = require('axios');
const discord = require('discord.js');
const userAgent = require('user-agents');
const agent = new userAgent().random().data;

const xSuperProperties = () => {
    return Buffer.from(JSON.stringify({
        'os': agent.platform,
        'browser': ['Firefox', 'Chrome', 'Edge', 'Brave'][Math.floor(Math.random() * 4)],
        'device':'',
        'browser_user_agent': agent.userAgent,
        'browser_version': (Math.random() * (999.99 - 1.0 + 1) + 1.0).toFixed(3),
        'os_version': '' + [10, 9, 8, 7][Math.floor(Math.random() * 4)],
        'referrer': '',
        'referring_domain': '',
        'referrer_current': '',
        'referring_domain_current': '',
        'release_channel': 'stable',
        'client_build_number': Math.floor(Math.random() * (99999 - 10000 + 1) + 10000),
        'client_event_source': null
    })).toString('base64');
};

const xProperties = (link) => {
  return new Promise( (resolve, reject) => {
      axios.get(process.env.API + '/invites/' + link).then(response => {
          if (response.status === 200) {
              resolve (Buffer.from(JSON.stringify({
                  'location':'Accept Invite Page',
                  'location_guild_id':response.data.guild.id ,
                  'location_channel_id':response.data.channel.id,
                  'location_channel_type':response.data.channel.type
              })).toString('base64'));
          }
          else {
              reject({'error': 'invalid response'})
          }
      }).catch(err => {
          reject({'error': err})
      });
  })
};

module.exports = {
    /*
    * Join method is used to check if a discord.gg/link is still UP. If it is, it joins.
    */
    join: (token, link) => {
        return new Promise((resolve, reject) => {
            xProperties(link).then(header => {
                axios.post(process.env.API + '/invites/' + link,{},{
                    headers:{
                        'Authorization': token,
                        'Content-Type':'application/json',
                        'User-Agent':agent.userAgent,
                        'Accept':'*/*',
                        'Accept-Language': 'en-US',
                        'X-Context-Properties':header,
                        'X-Super-Properties':xSuperProperties(),
                        // TODO : 'X-FINGERPRINT'
                    }
                }).then(res => {
                    resolve(res.data)
                }).catch(err => {
                    reject({'error':err})
                });
            }).catch(err => {
                reject({'error':err})
            });
        });
    },
    /*
    * Users method request every users for a given guildID. If the bot is not in the guild, returns an error.
    * I'll refactor this later to avoid websocket.
    */
    users: (token, guild) => {
        return new Promise((resolve, reject) => {
            const client = new discord.Client(); // We need to use WebSocket because API SUCKS for unknown reasons
            client.login(token).catch(err => {
                reject ({'error':'token is rejected for some reason'});
            });
            client.on('ready', () => {
                client.guilds.get(guild).fetchMembers().then(list => {
                    const userObject = [];
                    list.members.forEach(member => {
                        // Since the settings object is only available for the bot, we don't parse it. 1000
                        if(!member.user.settings) {
                            userObject.push({
                                'userID': member.user.id,
                                'pseudo': member.user.username + '#' + member.user.discriminator,
                                'avatar': member.user.avatar
                                //'activity': member.presence.game
                            });
                        }
                    });
                    client.destroy().catch(() => reject({'error':'could\'t destroy this fkin client'}));
                    resolve(userObject);
                }).catch(err => {
                    client.destroy().catch(() => reject({'error':'could\'t destroy this fkin client'}));
                    reject({'error':'user is not in this guild'});
                });
             });
        });
    },
    /*
    * Inspect method search for every juicy ressources on the specified server.
    */
    inspect: (token, guild) => {
        return new Promise((resolve, reject) => {
            axios.get(process.env.API + '/guilds/' + guild + '/channels', {
                headers: {
                    'Authorization': token,
                    'Content-Type':'application/json'
                }
            }).then(res => {
                const chatsID = [];
                res.data.forEach(chat => {
                    if (chat.type === 0) {
                        chatsID.push(chat.id);
                    }
                });
                const rawMessages = chatsID.map(chatID => {
                    return axios.get(process.env.API + '/channels/' + chatID + '/messages', {
                        headers: {
                            'Authorization': token,
                            'Content-Type':'application/json'
                        }
                    })
                });
                Promise.allSettled(rawMessages).then(responses => {
                    const juicyObject = responses.map(response => {
                        if (response.status ==='fulfilled') {
                            return (analyser.messages(response.value.data));
                        }
                    });
                    Promise.all(juicyObject).then(juicyMessage => {
                        resolve(juicyMessage);
                    })
                })
            }).catch(err => {
                reject({'error':err});
            });
        });
    },
    /*
    * Profile method search for a user and extract its informations.
    */
    profile : (token, userID) => {
        return new Promise ((resolve, reject) => {
            axios.get(process.env.API + '/users/' + userID + '/profile', {
                headers: {
                    'Authorization': token,
                    'Content-Type':'application/json'
                }
            }).then(profile => {
                const linkObject = {};
                linkObject.userID = profile.data.user.id;
                linkObject.update = {};
                profile.data.connected_accounts.forEach(links => {
                    if (links.type) {
                        linkObject.update[links.type] = links.name;
                    }
                    resolve(linkObject);
                });
            }).catch(err => {
                reject(err);
            })
        });
    }
};