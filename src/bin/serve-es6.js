import * as path from 'path';
import run from 'dist-es6/lib/run';

const packageJson = require(path.resolve('package.json'));
run.module(path.resolve(packageJson.main || 'server.js'));
