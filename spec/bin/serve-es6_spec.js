import {childProcess} from 'node-promise-es6';
import fetch from 'node-fetch';
import Directory from 'directory-helpers';

class Project extends Directory {
  async stop() {
    try {
      const {stdout: serverPid} = await childProcess.exec("pgrep -f 'node.*serve-es6$'");
      await childProcess.exec(`kill ${serverPid}`);
    } catch (error) {
      if (error.message.indexOf("pgrep -f 'node.*serve-es6$'") === -1) {
        throw error;
      }
    }
  }
}

describe('serve-es6', () => {
  afterEach(async () => {
    const project = new Project('project');
    await project.stop();
    await project.remove();
  });

  it('runs the main file of a project', async () => {
    const project = new Project('project');
    await project.write({
      'package.json': {
        name: 'project',
        main: 'src/index.js',
        scripts: {
          start: 'serve-es6'
        }
      },
      'src/index.js': `
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
      `
    });
    expect(await project.exec('npm', ['start']))
      .toContain('1...2...3...done');
  });

  it('runs the server.js if a main file is not specified', async () => {
    const project = new Project('project');
    await project.write({
      'package.json': {
        name: 'project',
        scripts: {
          start: 'serve-es6'
        }
      },
      'server.js': `
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
      `
    });
    expect(await project.exec('npm', ['start']))
      .toContain('1...2...3...done');
  });

  it('runs a web server', async () => {
    const project = new Project('project');
    await project.write({
      'package.json': {
        name: 'project',
        main: 'src/index.js',
        scripts: {
          start: 'serve-es6'
        }
      },
      'src/index.js': `
        var http = require('http');
        var server = http.createServer((request, response) => {
          response.end(request.url, 'utf8');
        });
        server.listen(3000, () => process.stdout.write('Listening\\n'));
      `
    });
    await project
      .spawn('npm', ['start'])
      .filter((output) => output.match(/Listening/));

    const response = await fetch('http://localhost:3000/ping');
    expect(await response.text()).toBe('/ping');
  });
});
