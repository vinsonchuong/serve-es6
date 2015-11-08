# serve-es6
[![Build Status](https://travis-ci.org/vinsonchuong/serve-es6.svg?branch=master)](https://travis-ci.org/vinsonchuong/serve-es6)

An executable that seamlessly runs Node.js servers and web apps written in ES6+.

## Installing
`serve-es6` is available as an
[npm package](https://www.npmjs.com/package/serve-es6).

## Usage
In your `package.json`, run the `serve-es6` command from the `start` script as
follows:

```json
{
  "name": "project",
  "scripts": {
    "start": "serve-es6"
  }
}
```

Then, run `npm start`. By default, `serve-es6` will look for and run
`server.js`. Specify a different file via the `main` key of the `package.json`
as follows:

```json
{
  "name": "project",
  "main": "src/app.js",
  "scripts": {
    "start": "serve-es6"
  }
}
```

## Development
### Getting Started
The application requires the following external dependencies:
* Node.js

The rest of the dependencies are handled through:
```bash
npm install
```

Run tests with:
```bash
npm test
```
