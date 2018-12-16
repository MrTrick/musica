const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 5000;

const storage = require('./src/storage.js');

app.use(morgan('short'));

app.get('/musica', (req, res) => {
  storage.index().then((index)=>res.json(index));
});

app.get('/musica/:id', (req, res) => {
  storage.read(req.params.id).then((data)=>res.json(data));
})

app.listen(port, () => console.log(`Listening on port ${port}`));
