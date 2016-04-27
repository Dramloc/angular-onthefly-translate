'use strict';

let winston = require('winston');
let fs = require('fs');
let path = require('path');
let express = require('express');
let bodyParser = require('body-parser');
let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/', express.static('public'));
app.get('/', (req, res) => {
    res.sendfile('public/index.html');
});

function loadJSON(path, callback) {
    fs.readFile(path, 'utf8', (err, file) => {
        if (err) {
            return callback(undefined);
        }
        try {
            return callback(JSON.parse(file));
        } catch (e) {
            winston.error('Failed to parse file ' + filepath, e);
            throw e;
        }
    });
}

/**
 * Get translations for guven locale.
 */
app.get('/i18n/:locale', (req, res) => {
    let locale = req.params.locale;
    let filepath = path.join(__dirname, 'i18n', 'messages-' + locale + '.json');
    winston.debug('Requesting i18n data for locale.', {
        locale: locale,
        file: filepath
    });

    loadJSON(filepath, (json) => {
        if (undefined === json) {
            return res.sendStatus(404);
        }
        return res.json(json);
    });
});

/**
 * Update translation for given locale with (key, value) pair in request body
 */
app.put('/i18n/:locale', (req, res) => {
    let locale = req.params.locale;
    let key = req.body.key;
    let value = req.body.value;
    let filepath = path.join(__dirname, 'i18n', 'messages-' + locale + '.json');
    winston.info('Updating translation.', {
        locale: locale,
        key: key,
        value: value
    });

    loadJSON(filepath, (json) => {
        if (undefined === json) {
            winston.info('Creating file for locale ' + locale);
            json = {};
        }
        json[key] = value;

        fs.writeFile(filepath, JSON.stringify(json), function (err) {
            if (err) {
                return res.status(500).send('Failed to persist translation');
            }
            return res.status(204).send('Translation modifier');
        });
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    winston.info('Server started on port ' + port);
});