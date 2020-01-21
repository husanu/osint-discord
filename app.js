const express = require('express');
const bodyParser = require('body-parser');

const app = express();

require('dotenv').config();

// tokens.add('NjY3NTAzNzk4NzM0MDI4ODM5.XiDrlQ.vGol0urdQ6xZGt-FiXxeeJCtf1Y').then((res) => {
//     console.log(res)
// }).catch(err => {
//     console.log(err)
// });

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_DOMAINS);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.listen(process.env.APP_PORT, () => {
    console.log('server started on port ' + process.env.APP_PORT)
});