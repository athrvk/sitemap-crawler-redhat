const express = require('express');
const cors = require('cors');
const crawler = require('./routes/crawl');

const app = express();
app.use(express.static('client'));
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/crawl', crawler);

app.get('/', (req, res) => {
    res.sendFile(__dirname + 'client/index.html');
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});