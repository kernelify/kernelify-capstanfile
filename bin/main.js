#!/usr/bin/env node

var path = require('path');
var util = require('util');

var findFiles = require('../lib/find-files');

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

var dir = argv._[0] || process.cwd();
var ignores = [ '.git' ];
var files = findFiles(dir, ignores)
  .map(function(file) { return '    ' + prefix + '/' + file + ': ' + file; })
  .join('\n');

var file = function(f) { return ~files.indexOf(prefix + '/' + f) && f; };
var package = {};
if (file('package.json'))
  try { package = require(path.join(dir, 'package.json')); } catch(e) {}

var main = package.entry ||
  file('server.js') ||
  file('main.js') ||
  file('index.js') ||
  file('bin/main.js') ||
  'server.js';

var capstanfile = util.format(template, prefix, main, files);
console.log(capstanfile);
