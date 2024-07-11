const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const messages = require('./messages');
const port = 3000;
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static('public'));

app.get('/about', (req, res) => {
    res.send(messages.about);
});
app.get('/initial', (req, res) => {
    res.sendStatus(200);
});
app.listen(port, () => {
    console.log(`The server is running at http://localhost:${port}`);
});