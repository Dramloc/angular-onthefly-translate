'use strict';

const winston = require('winston');
const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const extend = require('extend');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use('/', express.static(path.join(__dirname, '..', 'public')));
app.get('/', (req, res) => {
  res.sendfile(path.resolve(__dirname, '..', 'public', 'index.html'));
});

function loadJSON(filepath, callback) {
  fs.readFile(filepath, 'utf8', (err, file) => {
    if (err) {
      return callback(undefined);
    }
    try {
      return callback(JSON.parse(file));
    } catch (e) {
      winston.error(`Failed to parse file ${filepath}`, e);
      throw e;
    }
  });
}

/**
 * Get translations for given locale.
 */
app.get('/i18n/:locale', (req, res) => {
  const locale = req.params.locale;
  const filepath = path.join(__dirname, '..', 'i18n', `messages-${locale}.json`);
  winston.debug('Requesting i18n data for locale.', {
    locale,
    file: filepath,
  });

  loadJSON(filepath, (json) => {
    if (undefined === json) {
      return res.json({});
    }
    return res.json(json);
  });
});

/**
 * Update translation for given locale with (key, value) pair in request body
 */
app.put('/i18n/:locale', (req, res) => {
  const locale = req.params.locale;
  const diff = req.body;
  const filepath = path.join(__dirname, '..', 'i18n', `messages-${locale}.json`);
  winston.info('Updating translation.', {
    locale,
    diff
  });

  loadJSON(filepath, (json) => {
    let master = json;
    if (undefined === master) {
      winston.info(`Creating file for locale ${locale}.`);
      master = {};
    }
    extend(false, master, diff);

    fs.writeFile(filepath, JSON.stringify(master), (err) => {
      if (err) {
        return res.status(500).send('Failed to persist translation');
      }
      return res.status(200).send('Translation updated');
    });
  });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  winston.info(`Server started on port ${port}`);
});
