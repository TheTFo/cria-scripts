var glob = require("glob")
var path = require('path');
var compileLess = require('./compileLess');

if (process.argv.length < 3) {
    console.log('Usage: node buildCss.js src dest');
    return;
}

var src = path.join(process.cwd(), process.argv[2]);
var dest = process.argv.length > 3 ? path.join(process.cwd(), process.argv[3]) : src; 

const globOptions = {
    cwd: src,
};

glob("**/*.less", globOptions, (er, files) => {
    if (files && files.length) {
        files.forEach(f => {
            compileLess(path.join(src, f), path.join(dest, f.substring(0, f.length - 4) + 'css'));
        });
    }
});

