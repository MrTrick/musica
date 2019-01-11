/**
 * server.js
 * Entry point for the musica server
 * @license MIT License (c) copyright 2018 Patrick Barnes
 * @author Patrick Barnes
 */
require('dotenv/config');
const express = require('express');
const morgan = require('morgan');
const storageBuilder = require('./src/storage');

const app = express();
const port = process.env.PORT || 5000;
const storage = storageBuilder();

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
