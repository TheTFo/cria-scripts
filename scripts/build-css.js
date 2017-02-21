var glob = require("glob")
var path = require('path');
var compileLess = require('./compile-less');

const defaultSrc = 'src';

var src = process.argv.length > 2 ? path.join(process.cwd(), process.argv[2]) : defaultSrc;
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

