import path from 'path';
import {fs, childProcess} from 'node-promise-es6';
import * as fse from 'fs-extra-promise-es6';
import fetch from 'node-fetch';

function promiseEvent(eventEmitter, event) {
  return new Promise(resolve =>
    eventEmitter.once(event, result =>
      resolve(result)
    )
  );
}

describe('serve-es6', () => {
  afterEach(async () => {
    try {
      const {stdout: serverPid} = await childProcess.exec(`pgrep -f 'node.*serve-es6$'`);
      await childProcess.exec(`kill ${serverPid}`);
    } catch (error) {
      if (error.message.indexOf(`pgrep -f 'node.*serve-es6$'`) === -1) {
        throw error;
      }
    }
    await fse.remove(path.resolve('project'));
  });

  it('runs the main file of a project', async () => {
    await fse.mkdirs(path.resolve('project/src'));
    await fse.writeJson(path.resolve('project/package.json'), {
      name: 'project',
      main: 'src/index.js',
      scripts: {
        start: 'serve-es6'
      }
    });
    await fs.writeFile(path.resolve('project/src/index.js'), `
      async function sleep(ms) {
        await new Promise(resolve => setTimeout(() => resolve(), ms));
      }

      async function run() {
        process.stdout.write('1...');
        await sleep(100);
        process.stdout.write('2...');
        await sleep(100);
        process.stdout.write('3...');
        await sleep(100);
        process.stdout.write('done\\n');
      }

      run();
    `);

    const child = childProcess.spawn('npm', ['start'], {
      cwd: path.resolve('project')
    });

    let output = '';
    child.stdout.on('data', text => output += text);
    child.stderr.on('data', text => output += text);

    await promiseEvent(child, 'exit');

    expect(output).toContain('1...2...3...done\n');
  });

  it('runs a web server', async () => {
    await fse.mkdirs(path.resolve('project/src'));
    await fse.writeJson(path.resolve('project/package.json'), {
      name: 'project',
      main: 'src/index.js',
      scripts: {
        start: 'serve-es6'
      }
    });
    await fs.writeFile(path.resolve('project/src/index.js'), `
      var http = require('http');
      var server = http.createServer((request, response) => {
        response.end(request.url, 'utf8');
      });
      server.listen(3000, () => process.stdout.write('Listening\\n'));
    `);

    const child = childProcess.spawn('npm', ['start'], {
      cwd: path.resolve('project')
    });

    await new Promise(resolve =>
      child.stdout.on('data', data => {
        if (data.toString().indexOf('Listening') > -1) {
          resolve();
        }
      })
    );

    const response = await fetch('http://localhost:3000/ping');
    expect(await response.text()).toBe('/ping');
  });
});
