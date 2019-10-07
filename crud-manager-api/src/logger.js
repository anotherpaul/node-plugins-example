/* eslint-disable no-console */
function makeLog(...args) {
  const data = args.map(v => (typeof v === 'object' ? JSON.stringify(v, null, 2) : v)).join(' ');
  const timestamp = new Date().toISOString();
  return `${timestamp}: ${data}`;
}

function createLogger() {
  return {
    log: (...args) => console.log(makeLog(...args)),
    error: (...args) => console.error(makeLog(...args)),
    debug: (...args) => console.log(makeLog(...args)),
  };
}

module.exports = createLogger;
