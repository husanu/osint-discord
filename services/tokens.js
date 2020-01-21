const axios = require('axios');
const models = require('../models');

module.exports = {
    add: (token) => {
        return new Promise((resolve, reject) => {
            axios.get(
                'https://discordapp.com/api/users/@me',
                {headers: {
                        'Authorization':token,
                        'Content-Type':'application/json'
                    }}
            ).then(res => {
                models.Token.findOne({
                    where: { value: token }
                }).then(foundToken => {
                    if (foundToken) {
                        reject ({'error':'token already registered'})
                    }
                    else {
                        models.Token.create({
                            value: token,
                            userId: res.data.id
                        }).then(newToken => {
                            resolve ({'newTokenID': newToken.id})
                        }).catch(err => {
                            reject ({'error':'MySQL exception'})
                        })
                    }
                })
            }).catch(err => {
                reject ({'error':'invalid token'})
            })
        });
    }
};