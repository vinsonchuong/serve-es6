import {exec} from 'node-promise-es6/child-process';

describe('serve-es6', function() {
  it('outputs "3...2...1...Hello World!"', async function() {
    const {stdout} = await exec('serve-es6');
    expect(stdout.trim()).toBe('3...2...1...Hello World!');
  });
});
