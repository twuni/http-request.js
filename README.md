# @twuni/http-request

[![CircleCI][1]][2]
[![npm version][3]][4]
[![npm downloads][5]][4]
[![dependencies][6]][7]
[![devDependencies][8]][7]
[![license][9]][10]

Minimalist API for HTTP requests from Node.js or browsers.

## Installing

Using [`yarn`][11]:

```
yarn add @twuni/http-request
```

Using [`npm`][12]:

```
npm install @twuni/http-request
```

## Usage

First, import the module:

```javascript
// Using ES6 modules:
import { http } from '@twuni/http-request';

// ...or, if you are using CommonJS modules:
const { http } = require('@twuni/http-request');
```

Then, you can use the `http()` function like this:

```javascript
const response = await http('https://example.com/hello.json');
// response: { body: ArrayBuffer, headers: {}, status: { code: number, text: string } }
```

### Options

Additional options for the request may be configured via an optional
second argument. All available options are described below along with
their default values:

```javascript
await http(url, {
  // The request body, in any format allowed by the Fetch spec (https://fetch.spec.whatwg.org/#bodyinit)
  body: undefined,

  // Key-value pairs for the request headers to be sent. Forbidden headers are excluded (https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name)
  headers: {},

  // If true, the browser will send credentials along with this request (https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/withCredentials)
  includeCredentials: false,

  // The HTTP method to use for this request (https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods)
  method: 'GET',

  // How long, in milliseconds, to wait for a response before considering the request to have timed out.
  timeout: 300000
});
```

[1]: https://img.shields.io/circleci/build/github/twuni/http-request.js
[2]: https://circleci.com/gh/twuni/http-request.js
[3]: https://img.shields.io/npm/v/@twuni/http-request.svg
[4]: https://www.npmjs.com/package/@twuni/http-request
[5]: https://img.shields.io/npm/dt/@twuni/http-request.svg
[6]: https://img.shields.io/david/twuni/http-request.js.svg
[7]: https://github.com/twuni/http-request.js/blob/master/package.json
[8]: https://img.shields.io/david/dev/twuni/http-request.js.svg
[9]: https://img.shields.io/github/license/twuni/http-request.js.svg
[10]: https://github.com/twuni/http-request.js/blob/master/LICENSE.md
[11]: https://yarnpkg.com/
[12]: https://npmjs.com/package/npm
