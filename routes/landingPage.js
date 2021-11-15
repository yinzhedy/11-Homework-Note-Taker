const landingPage = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');

landingPage.get('/', (req, res) => {
    readFromFile('./db/diagnostics.json').then((data) =>
      res.json(JSON.parse(data))
    );
  });