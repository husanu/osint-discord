const models = require('../models');
const axios = require('axios');
const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y', 'Z',
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

module.exports = {
    bruteforce: () => {
        return new Promise ((resolve, reject) => {
            let link = [];
            while (link.length <= 6) {
                link += alphabet[Math.floor(Math.random() * alphabet.length)];
            }
            link = 'zrA9tY';
            axios.get('https://discordapp.com/api/invites/' + link).then(res => {
                resolve ({'link':link, 'data':res.data});
            }).catch(err => {
                reject (err);
            })
        });
    },
    save: (link) => {
        return new Promise ((resolve, reject) => {
               axios.get('https://discordapp.com/api/v6/invites/' + link, {}).then(res => {
                   models.Server.findOne({
                      where: { serverId: res.data.guild.id }
                   }).then(server => {
                       if (server) {
                           reject ({'error':'this server is already registered' })
                       }
                       else {
                           models.Server.create({
                               serverId: res.data.guild.id,
                               name: res.data.guild.name,
                               link: link,
                               parsed: false
                           }).then(newServ => {
                               resolve ({'success':newServ});
                           }).catch(err => {
                               reject ({'error':'MySQL exception'})
                           })
                       }
                   }).catch(err => {
                       reject ({'error':err});
                   });
               }).catch(err => {
                   console.log(err)
               })
        })
    }
};