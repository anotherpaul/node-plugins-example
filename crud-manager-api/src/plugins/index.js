const createController = require('./controller');

function createPluginsResource(dependencies) {
  return {
    name: 'plugins',
    properties: {
      name: { type: 'string', required: true, unique: true },
      properties: { type: 'object', required: true },
      route: { type: 'string', required: true },
    },
    route: '/plugins',
    createController: createController(dependencies),
  };
}

module.exports = createPluginsResource;
