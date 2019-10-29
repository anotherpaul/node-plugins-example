const Redis = require('ioredis');
const crudmaker = require('crudmaker');

const config = require('../config');
const logger = require('../logger')();
const addUploadRoute = require('./server');
const createPackageManager = require('./package-manager');

async function init({ dependencies }) {
  const pub = new Redis(config.redisConfig);
  const sub = new Redis(config.redisConfig);

  const packageManager = createPackageManager();

  async function processUploadedPackage(installInfo) {
    logger.debug(`new npm plugin: ${installInfo.name}`);
    const { loadedPackage } = packageManager.loadPackage(installInfo.name);
    crudmaker.create({ resource: loadedPackage, dependencies });
  }

  async function uploadPackage(req, res) {
    const packageUrl = `http://${config.server.hostname}:${config.server.port}/${req.file.filename}`;
    await packageManager.install(req.body.name, packageUrl);
    const result = await crudmaker.get('npmplugins').storage.create({ packageUrl, name: req.body.name });
    await pub.publish(config.newNpmPluginChannel, JSON.stringify(result));
    return res.status(200).send(`uploaded ${req.file.filename}`);
  }

  sub.subscribe(config.newNpmPluginChannel);
  sub.on('message', (channel, message) => {
    const plugin = JSON.parse(message);
    processUploadedPackage(plugin);
  });

  await addUploadRoute(dependencies.server, uploadPackage);
  await packageManager.init();
}

module.exports = init;
