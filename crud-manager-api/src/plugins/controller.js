const crudmaker = require('crudmaker');
const Redis = require('ioredis');
const config = require('../config');

const pub = new Redis(config.redisConfig);
const sub = new Redis(config.redisConfig);

function wrapCreateController(dependencies) {
  sub.subscribe();
  function createController({ base, logger }) {
    sub.subscribe(config.newPluginChannel);
    sub.on('message', (channel, message) => {
      const plugin = JSON.parse(message);
      logger.log(`new plugin: ${plugin.name}`);
      crudmaker.create({ resource: plugin, dependencies });
    });

    async function create(payload) {
      const result = await base.create(payload);
      await pub.publish(config.newPluginChannel, JSON.stringify(payload));
      return result;
    }

    return {
      create,
    };
  }

  return createController;
}

module.exports = wrapCreateController;
