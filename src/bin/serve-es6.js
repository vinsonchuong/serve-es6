#!/usr/bin/env node
var path = require('path');
var fs = require('fs');

require('babel/register')({stage: 0});

fs.readFile(path.resolve('package.json'), 'utf8', function(error, contents) {
  if (error) {
    throw error;
  }
  var packageJson = JSON.parse(contents);
  require(path.resolve(packageJson.main));
});
