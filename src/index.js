/* eslint-disable no-magic-numbers */
const DEFAULT_OPTIONS = Object.freeze({
  XMLHttpRequest: typeof XMLHttpRequest === 'undefined' ? undefined : XMLHttpRequest,
  body: undefined,
  headers: {},
  includeCredentials: false,
  method: 'GET',
  timeout: 300000
});
/* eslint-enable no-magic-numbers */

const HEADER_DELIMITER = ': ';

const buildResponse = (request) => ({
  body: request.response,
  headers: request.getAllResponseHeaders().split('\r\n').reduce((headers, pair) => {
    const index = pair.indexOf(HEADER_DELIMITER);
    const key = pair.substring(0, index);
    const value = pair.substring(index + HEADER_DELIMITER.length);
    headers[key] = value;
    return headers;
  }, {}),
  status: {
    code: request.status,
    text: request.statusText
  }
});

const assertValidURL = (url) => {
  // Defer to URL constructor for input validation of "url" parameter
  // eslint-disable-next-line
  new URL(url);
};

const http = (url, options = {}) => {
  assertValidURL(url);

  // eslint-disable-next-line max-statements
  return new Promise((resolve, reject) => {
    const {
      body,
      headers,
      includeCredentials,
      method,
      timeout,
      XMLHttpRequest
    } = Object.assign({}, DEFAULT_OPTIONS, options);

    const request = new XMLHttpRequest();

    request.open(method, url, true);

    request.responseType = 'arraybuffer';
    request.timeout = timeout;
    request.withCredentials = includeCredentials;

    for (const key of Object.keys(headers)) {
      request.setRequestHeader(key, headers[key]);
    }

    request.addEventListener('load', () => resolve(buildResponse(request)));

    request.addEventListener('error', () => {
      const error = new Error('Encountered an error while attempting to process this request.');
      error.response = buildResponse(request);
      reject(error);
    });

    request.send(body);
  });
};

export { http };

export default http;
