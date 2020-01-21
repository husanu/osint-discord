const axios = require('axios');
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
      axios.get('https://discordapp.com/api/v6/invites/' + link).then(response => {
          if (response.status === 200) {
              resolve (Buffer.from(JSON.stringify({
                 'location':'Accept Invite Page',
                 'location_guild_id':response.data.guild.id ,
                 'location_channel_id':response.data.channel.id,
                  'location_channel_type':response.data.channel.type
              })).toString('base64'));
          }
          else {
              reject ({'error': 'invalid response'})
          }
      }).catch(err => {
          reject ({'error': err})
      })
  })
};

module.exports = {
    users: (token) => {
        axios.get('http://discordapp.com/api/guilds/' + guildID +'/members/', {
            headers: {
                'Authorization': userToken,
                'Content-Type':'application/json'
            }
        }).then(res => {
            console.log(res)
        }).catch(err => {
            console.log(err)
        })
    },
    join: (token, link) => {
        return new Promise((resolve, reject) => {
            xProperties(link).then(header => {
                console.log(agent.userAgent);
                axios.post('https://discordapp.com/api/v6/invites/' + link, {},{
                    headers:{
                        'Authorization': token.value,
                        'Content-Type':'application/json',
                        'User-Agent':agent.userAgent,
                        'Accept':'*/*',
                        'Accept-Language': 'en-US',
                        'X-Context-Properties':header,
                        'X-Super-Properties':xSuperProperties(),
                        //TODO : 'X-FINGERPRINT'
                    }
                }).then(res => {
                    console.log(res);
                    resolve ({'success': res})
                }).catch(err => {
                    reject ({'error':err})
                })
            }).catch(err => {
                reject ({'error':err})
            });
        });
    }
};