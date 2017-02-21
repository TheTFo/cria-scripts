var fs = require('fs');
var path = require('path');
var watch = require('watch');
var buildI18n = require('./build-i18n');

var watchRoot = path.join(process.cwd(), "src");
var watchOptions = {
    interval: 0.2,
    filter: (f) => {
        return fs.lstatSync(f).isDirectory() || 
            (f.substr(f.length - 3) === '.js' && f.substr(f.length - 7) !== '.svg.js' && f.substr(f.length - 8) !== '.test.js');
    }
}

watch.watchTree(watchRoot, watchOptions, (f, curr, prev) => {
    if (typeof f == "object" && prev === null && curr === null) {
        // Finished walking the tree
    } else if (prev === null) {
        // f is a new file
        buildI18n();
    } else if (curr.nlink === 0) {
        // f was removed
    } else {
        // f is modified
        buildI18n();
    }
});
