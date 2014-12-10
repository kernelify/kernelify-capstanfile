#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var globToRegExp = require('glob-to-regexp');

var argv = require('optimist')
    .usage('Usage: $0 [directory]')
    .argv;

var template = [
  'base: cloudius/osv-node\n',
  'cmdline: /libnode.so /hello.js\n',
  'files:'
].join('\n');
var prefix = '/app';

var ignores = [
  '.git'
].map(globToRegExp);

var baseDir = argv._[0] || process.cwd();
var files = collectFiles(baseDir)
  .map(function(file) {
    return '    ' + prefix + '/' + file + ': ' + file;
  })
  .join('\n');
var ignores = [
  '.*'
].map(globToRegExp);
console.log(template + '\n' + files);

function collectFiles(dir) {
  var files = [];

  fs.readdirSync(dir)
    .forEach(process);

  return files;

  function process(node) {
    if (ignore(node))
        return;

    var fullPath = path.join(dir, node);
    if (fs.statSync(fullPath).isDirectory())
      files = files.concat(collectFiles(fullPath));
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
