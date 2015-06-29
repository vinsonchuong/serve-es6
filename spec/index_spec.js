import serveEs6 from 'serve-es6';

describe('serve-es6', function() {
  it('exports "Hello World!"', function() {
    expect(serveEs6).toBe('Hello World!');
  });
});
