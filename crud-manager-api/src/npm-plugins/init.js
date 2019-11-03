const Redis = require('ioredis');
const crudmaker = require('crudmaker');
const createHotInstaller = require('hot-installer');

const config = require('../config');
const logger = require('../logger')();
const addUploadRoute = require('./server');

async function init({ dependencies }) {
  const pub = new Redis(config.redisConfig);
  const sub = new Redis(config.redisConfig);
  const hotInstaller = await createHotInstaller({ installPath: config.installPath });

  async function processInstalledPackage(packageName) {
    logger.log(`new npm plugin: ${packageName}`);
    const plugin = hotInstaller.load(packageName);
    logger.log('loaded npm plugin', plugin.name, plugin.version);
    await crudmaker.create({ resource: plugin.exports, dependencies });
    logger.log('created new crud with crudmaker for', plugin.name);
  }

  async function installPackage(req, res) {
    const packageUrl = `http://${config.server.hostname}:${config.server.port}/${req.file.filename}`;
    try {
      logger.log('installing', packageUrl);
      await hotInstaller.install(packageUrl);
      logger.log('installed, creating npmplugin', req.body.name);
      const result = await crudmaker.get('npmplugins').storage.create({ packageUrl, name: req.body.name });
      logger.log('publishing message');
      await pub.publish(config.newNpmPluginChannel, JSON.stringify(result));
      logger.log('message published');
    } catch (err) {
      return res.status(500).send(`error installing ${req.body.name} from ${packageUrl}`);
    }
    return res.status(200).send(`uploaded ${req.file.filename}`);
  }

  sub.subscribe(config.newNpmPluginChannel);
  sub.on('message', (channel, message) => {
    if (channel === config.newNpmPluginChannel) {
      const plugin = JSON.parse(message);
      processInstalledPackage(plugin.name);
    }
  });

  await addUploadRoute(dependencies.server, installPackage);
  await hotInstaller.init();
}

module.exports = init;
