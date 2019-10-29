const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crudmaker = require('crudmaker');
const cors = require('cors');

const createLogger = require('./logger');
const config = require('./config');
const createBasicPluginsResource = require('./basic-plugins');
const npmPluginsResource = require('./npm-plugins');

const logger = createLogger();

async function startApp() {
  const server = express();
  const dependencies = { mongoose, server, logger };
  try {
    await mongoose.connect(config.mongoConnectionString, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true,
    });
    server.use(bodyParser.json());
    server.use(cors());
    server.use(express.static(config.filePath));
    crudmaker.create({ resource: createBasicPluginsResource(dependencies), dependencies });
    crudmaker.create({ resource: npmPluginsResource.resourceDescription, dependencies });
    await npmPluginsResource.init({ dependencies });
    server.listen(config.serverPort, () => logger.log(`server is listening on port ${config.serverPort}`));
  } catch (err) {
    logger.error(err.message || err.toString());
    setTimeout(startApp, config.serverInitIntervalMs);
  }
}

startApp();
