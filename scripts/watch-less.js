var fs = require('fs');
var path = require('path');
var watch = require('watch');
var compileLess = require('./compile-less');

var watchRoot = path.join(process.cwd(), "src");
var watchOptions = {
    interval: 0.2,
    filter: (f) => {
        return fs.lstatSync(f).isDirectory() || f.substr(f.length - 5) === '.less';
    }
}

watch.watchTree(watchRoot, watchOptions, (f, curr, prev) => {
    if (typeof f == "object" && prev === null && curr === null) {
        // Finished walking the tree
    } else if (prev === null) {
        // f is a new file
        compileLess(f, f.substr(0, f.length - 4) + 'css');
    } else if (curr.nlink === 0) {
        // f was removed
    } else {
        // f is modified
        compileLess(f, f.substr(0, f.length - 4) + 'css');
    }
});
