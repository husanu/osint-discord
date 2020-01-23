const wordlist = ['password', 'facebook', 'twitter'];

module.exports = {
  messages: (messages) => {
      return new Promise(resolve => {
          const juicyContent = [];
          messages.forEach(message => {
              if (wordlist.some(words => message.content.includes(words))) {
                  juicyContent.push({
                      'content': message.content,
                      'authorId': message.author.id,
                      'author': message.author.username + '#' + message.author.discriminator
                  })
              }
          });
          resolve (juicyContent);
      });
  }
};