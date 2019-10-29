const createController = require('./controller');

function createNpmPluginsResource(dependencies) {
  return {
    name: 'npmplugins',
    properties: {
      name: { type: 'string', required: true, unique: true },
      properties: { type: 'object', required: true },
      route: { type: 'string', required: true },
    },
    route: '/npm-plugins',
    createController: createController(dependencies),
  };
}

module.exports = createNpmPluginsResource;
