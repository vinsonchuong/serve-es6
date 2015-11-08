import path from 'path';
import fs from 'fs';

require('babel/register')({stage: 0});

fs.readFile(path.resolve('package.json'), 'utf8', (error, contents) => {
  if (error) {
    throw error;
  }
  const packageJson = JSON.parse(contents);
  require(path.resolve(packageJson.main || 'server.js'));
});
