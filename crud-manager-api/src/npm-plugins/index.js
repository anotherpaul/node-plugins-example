const init = require('./init');
const resourceDescription = {
  name: 'npmplugins',
  properties: {
    name: { type: 'string', required: true, unique: true },
    packageUrl: { type: 'string', required: true, unique: true },
  },
  route: '/npm-plugins',
};

module.exports = {
  init,
  resourceDescription,
};
