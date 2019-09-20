import { fake } from 'sinon';

export const mockXMLHttpRequest = (options = {}) => {
  const { events, onSend, overrides } = Object.assign({
    events: [],
    onSend: fake(),
    overrides: {}
  }, options);

  const XMLHttpRequest = function XMLHttpRequest() {
    const eventListeners = [];

    this.addEventListener = overrides.addEventListener || ((type, callback) => {
      eventListeners.push({ callback, type });
    });

    this.send = overrides.send || (() => setTimeout(() => {
      onSend(this);

      for (const event of events) {
        for (const { callback, type } of eventListeners) {
          if (type === event.type) {
            callback(event);
          }
        }
      }
    }, 0));

    return this;
  };

  XMLHttpRequest.prototype = Object.assign({
    getAllResponseHeaders: () => '',
    open: fake(),
    setRequestHeader: fake()
  }, overrides);

  return XMLHttpRequest;
};
