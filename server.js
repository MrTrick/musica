const express = require('express');
const morgan = require('morgan');
const app = express();
const port = process.env.PORT || 5000;

const Storage = require('./src/storage');
const storage = new Storage();

app.use(morgan('short'));

app.get('/musica', (req, res, next) => {
  storage.indexMetadata()
    .then((index)=>res.json(index))
    .catch(next);
});

app.get('/musica/:id', (req, res, next) => {
  storage.readMetadata(req.params.id)
    .then((data)=>res.json(data))
    .catch(next);
});

app.listen(port, () => console.log(`Listening on port ${port}`));
