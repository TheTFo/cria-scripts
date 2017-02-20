var glob = require("glob")
var fs = require('fs');
var mkdirp = require('mkdirp');
var path = require('path');
var convertSvgToJs = require('./convertSvgToJs')

if (process.argv.length < 3) {
    console.log('Usage: node svgToJs.js src dest');
    return;
}

var src = path.join(process.cwd(), process.argv[2]);
var dest = process.argv.length > 3 ? path.join(process.cwd(), process.argv[3]) : src;

const globOptions = {
    cwd: src,
};

const svgFilePattern = '**/*.svg';

glob(svgFilePattern, globOptions, (er, files) => {
    if (files && files.length) {
        files.forEach(f => {
            convertSvgToJs(path.join(src, f), path.join(dest, f + '.js'));
        });
    }
});

