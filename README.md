# OSINT Project
OSINT tool using `Discord API` to extract informations from discord servers.
## Progress
+ ~~Connect to a server~~
+ ~~Extract users list~~
+ ~~Search for socials~~
+ ~~Search for sensitive data~~
+ ~~Index every users/servers~~
+ Bruteforce invitation links | *working on it*
+ Use a proxy to avoid `Too many requests`
+ Handle multiple tokens
+ Allow everyone to crawl a given server
+ And many more...
## Install
It still in development. I highly recommand you to wait a stable version. 

If you know what you're doing:

Create ``.env`` and ``config/config.json`` files as following:

``.env``
```
APP_PORT        =
ALLOWED_DOMAINS =
API             =
```
``config/config.json``
```
{
  "development": {
    "username": "root",
    "password": null,
    "database": "database_develoment",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  }
}
```


Install dependencies 
```
npm install
```
Then create Database
```
npx sequelize-cli db:migrate
```
And finally
```
npm run start
```