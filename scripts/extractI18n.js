var fs = require('fs');
var path = require('path');
var glob = require("glob")
var mkdirp = require('mkdirp');
var Parser = require('i18next-scanner').Parser;
var async = require('async');

const srcFiles = 'src/**/!(*.test|*.svg).js';
const parserOptions = {
    lngs: ['en-US', 'en-GB', 'es-MX'],
    removeUnusedKeys: true,
    defaultNs: 'cria',
    defaultValue: '_NOT_TRANSLATED_'
};

function extractI18n() {
    var parser = new Parser(parserOptions);
    glob(srcFiles, (er, files) => {
        if (files && files.length) {
            async.map(files, fs.readFile, function (err, fileBuffers) {
                fileBuffers.forEach(fb => {
                    parser.parseFuncFromString(fb.toString(), { list: ['t'] });
                });

                var parserOutput = parser.get({ sort: true });

                parserOptions.lngs.forEach(lang => {
                    var destFile = path.join(process.cwd(), 'src', 'i18n', 'lang', lang + '.json');
                    mkdirp(path.dirname(destFile), (err) => {
                        if (err) {
                            throw err;
                        }

                        var output = JSON.stringify(parserOutput[lang], null, 4);
                        fs.writeFile(destFile, output, { flag: 'w' }, (err) => {
                            if (err) {
                                throw err;
                            }
                        });
                    });
                });
            });
        }
    });
}

extractI18n();

module.exports = extractI18n;