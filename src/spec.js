import { describe, it } from 'mocha';

import { expect } from 'chai';
import { fake } from 'sinon';
import { http } from '.';
import { mockXMLHttpRequest } from './spec.mocks';

describe('#http()', () => {
  it('throws an error when given an invalid URL', () => expect(() => http('totally not real')).to.throw(Error, /Invalid URL/g));

  it('eventually rejects when the underlying XMLHttpRequest emits an "error" event', () => {
    const XMLHttpRequest = mockXMLHttpRequest({ events: [{ type: 'error' }] });
    return expect(http('https://example.com', { XMLHttpRequest })).to.eventually.be.rejectedWith(Error);
  });

  it('eventually resolves when the underlying XMLHttpRequest emits a "load" event', () => {
    const XMLHttpRequest = mockXMLHttpRequest({ events: [{ type: 'load' }] });
    return expect(http('https://example.com', { XMLHttpRequest })).to.eventually.be.an('object');
  });

  it('sets the given request headers', async () => {
    const setRequestHeader = fake();
    const XMLHttpRequest = mockXMLHttpRequest({ events: [{ type: 'load' }], overrides: { setRequestHeader } });
    await http('https://example.com', { XMLHttpRequest, headers: { shouldBeSent: '<value to be sent>' } });
    expect(setRequestHeader).to.have.been.calledWith('shouldBeSent', '<value to be sent>');
  });

  describe('the resolution', () => {
    describe('#body', () => {
      it('matches the response body', () => {
        const expectedResponseBody = '<expected value>';
        const XMLHttpRequest = mockXMLHttpRequest({
          events: [{ type: 'load' }],
          onSend: (request) => {
            request.response = expectedResponseBody;
          }
        });
        return expect(http('https://example.com', { XMLHttpRequest })).to.eventually.have.property('body', expectedResponseBody);
      });
    });

    describe('#headers', () => {
      it('includes the response headers', () => {
        const XMLHttpRequest = mockXMLHttpRequest({
          events: [{ type: 'load' }],
          onSend: (request) => {
            request.getAllResponseHeaders = () => 'X-Expected-Header-Name: <expected-header-value>\r\n';
          }
        });
        return expect(http('https://example.com', { XMLHttpRequest })).to.eventually.have.nested.property('headers.X-Expected-Header-Name', '<expected-header-value>');
      });
    });

    describe('#status', () => {
      describe('#code', () => {
        it('matches the HTTP status code', () => {
          const XMLHttpRequest = mockXMLHttpRequest({
            events: [{ type: 'load' }],
            onSend: (request) => {
              request.status = Number('234');
            }
          });
          return expect(http('https://example.com', { XMLHttpRequest })).to.eventually.have.nested.property('status.code', Number('234'));
        });
      });

      describe('#text', () => {
        it('matches the HTTP status text', () => {
          const XMLHttpRequest = mockXMLHttpRequest({
            events: [{ type: 'load' }],
            onSend: (request) => {
              request.statusText = 'This is fine';
            }
          });
          return expect(http('https://example.com', { XMLHttpRequest })).to.eventually.have.nested.property('status.text', 'This is fine');
        });
      });
    });
  });
});
