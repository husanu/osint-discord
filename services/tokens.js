const axios = require('axios');
const models = require('../models');
const server = require('../services/serverFinder');

module.exports = {
    add: (token) => {
        return new Promise((resolve, reject) => {
            axios.get(
                process.env.API + '/users/@me',
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
    },
    get: () => {
        return new Promise((resolve, reject) => {
            const checkToken = async () => {
                try {
                    const token = await models.Token.findOne();
                    try {
                        await server.join(token, 'EZGVjZS')
                    } catch (err) {
                        await token.destroy();
                        await checkToken()
                    }
                } catch (err) {
                    reject ({'error':'no more token'})
                }
            };
            checkToken().then(token => {
                resolve(token)
            }).catch()
        });
    }
};