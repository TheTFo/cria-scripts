var fs = require('fs');
var path = require('path');
var mkdirp = require('mkdirp');
var less = require('less');

const lessOptions = {};

module.exports = function compileLess(srcFile, destFile) {
    fs.readFile(srcFile, 'utf8', (err, data) => {
        if (err) {
            return console.log(err);
        }
        less.render(data, lessOptions)
            .then((output) => {
                mkdirp(path.dirname(destFile), (err) => {
                    if (err) {
                        throw err;
                    }

                    fs.writeFile(destFile, output.css, { flag : 'w' }, (err) => {
                        if (err) {
                            throw err;
                        }
                    });    
                    
                });
                  
                // output.css = string of css
                // output.map = string of sourcemap
                // output.imports = array of string filenames of the imports referenced
            },
            (error) => {
                console.error(`Error compiling ${srcFile}: ${error.message}`);
            });
    });
}
