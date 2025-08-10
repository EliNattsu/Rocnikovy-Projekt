const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/*anything', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(3000, () => {
    console.log('Server běží na http://localhost:3000');
});