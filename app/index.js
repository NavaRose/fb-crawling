const express = require('express')
const apiCall = require('request');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/get-data/:key', (req, res) => {
    const searchKey = req.params.key;
    const config  = getConfig();
    config.then((params) => {
        let configData = JSON.parse(params);
        configData.config_data.q = searchKey;

        const options = {
            qs: configData.config_data,
            method: 'GET',
            uri: configData.get_data_url,
        }
        apiCall(options, (status, response, body) => {
            res.json(JSON.parse(body));
        });
    });
});

app.listen(3000, () => console.log('- Server is running'));

const getConfig = async () => {
    return fs.readFileSync('./config.json', 'utf8');
}