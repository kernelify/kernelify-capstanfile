#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var util = require('util');
var globToRegExp = require('glob-to-regexp');

var argv = require('optimist')
    .usage('Usage: $0 [directory]')
    .argv;

var template = [
  'base: cloudius/osv-node\n',
  'cmdline: /libnode.so %s/%s\n',
  'files:',
  '%s'
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

var main = 'server.js';
var capstanfile = util.format(template, prefix, main, files);
console.log(capstanfile);

function collectFiles(dir) {
  var files = [];

  fs.readdirSync(dir)
    .forEach(dealWith);

  return files;

  function dealWith(node) {
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
