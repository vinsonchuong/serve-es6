import path from 'path';
import fs from 'fs';

require('babel-core/register')({
  presets: ['es2015', 'stage-0'],
  plugins: ['transform-runtime']
});

fs.readFile(path.resolve('package.json'), 'utf8', (error, contents) => {
  if (error) {
    throw error;
  }
  const packageJson = JSON.parse(contents);

  /* eslint-disable lines-around-comment, global-require */
  require(path.resolve(packageJson.main || 'server.js'));
  /* eslint-enable lines-around-comment, global-require */
});
