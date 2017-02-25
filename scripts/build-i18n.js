var fs = require('fs');
var path = require('path');
var glob = require("glob")
var mkdirp = require('mkdirp');
var Parser = require('i18next-scanner').Parser;
var async = require('async');

var i18nConfig = require(path.join(process.cwd(), 'package.json')).i18n;

const srcFiles = 'src/**/!(*.test|*.svg).js';
const parserOptions = i18nConfig ? i18nConfig : {
    lngs: ['en-US'],
    removeUnusedKeys: true,
    defaultNs: 'translations',
    defaultValue: '_NOT_TRANSLATED_'
};

function buildI18n() {
    var parser = new Parser(parserOptions);
    glob(srcFiles, (er, files) => {
        if (files && files.length) {
            async.map(files, fs.readFile, function (err, fileBuffers) {
                fileBuffers.forEach(fb => {
                    parser.parseFuncFromString(fb.toString(), { list: ['t'] });
                });

                var parserOutput = parser.get({ sort: true });

                parserOptions.lngs.forEach(lang => {
                    parserOptions.ns.forEach(ns => {
                        var destFile = path.join(process.cwd(), 'public', 'i18n', 'lang', lang, ns + '.json');
                        mkdirp(path.dirname(destFile), (err) => {
                            if (err) {
                                throw err;
                            }

                            fs.readFile(destFile, (err, existingBuffer) => {
                                var output = parserOutput[lang][ns];
                                if (!err) {
                                    var existing = JSON.parse(existingBuffer);
                                    Object.keys(output).forEach((k) => {
                                        if (existing[k]) {
                                            output[k] = existing[k];
                                        }
                                    });
                                }

                                fs.writeFile(destFile, JSON.stringify(output, null, 4), { flag: 'w' }, (err) => {
                                    if (err) {
                                        throw err;
                                    }
                                });
                            });
                        });
                    });
                });
            });
        }
    });
}

buildI18n();

module.exports = buildI18n;