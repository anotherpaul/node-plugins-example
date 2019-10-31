const createController = require('./controller');

module.exports = {
  name: 'cities',
  properties: {
    name: { type: 'string', required: true, unique: true },
    population: { type: 'number' },
  },
  route: '/cities',
  createController,
};
