var fs = require('fs');
var path = require('path');
var globToRegExp = require('glob-to-regexp');

module.exports = findFiles;

function findFiles(baseDir, ignores) {
  ignores = ignores.map(globToRegExp);

  return recur(baseDir);

  function recur(dir) {
    var files = [];

    fs.readdirSync(dir)
      .forEach(dealWith);

    return files;

    function dealWith(node) {
      if (ignore(node))
          return;

      var fullPath = path.join(dir, node);
      if (fs.statSync(fullPath).isDirectory())
        files = files.concat(recur(fullPath));
      else
        files.push(path.relative(baseDir, fullPath));
    }

    function addFiles(add) {
      files = files.concat(add);
    }
  }

  function ignore(p) {
    return ignores.some(matches);

    function matches(regexp) {
      return regexp.test(p);
    }
  }
}
