var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var less = require('less');

module.exports = function convertSvgToJs(srcFile, destFile) {
    fs.readFile(srcFile, 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }

        //  Get rid of line breaks
        data = data.replace(/(\r\n|\n|\r)/gm, "");
        var output = 'module.exports=\'' + data + '\';';

        mkdirp(path.dirname(destFile), (err) => {
            if (err) {
                throw err;
            }

            fs.writeFile(destFile, output, { flag: 'w' }, (err) => {
                if (err) {
                    throw err;
                }
            });
        });
    });
}