const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const crudmaker = require('crudmaker');
const createLogger = require('./logger');
const config = require('./config');
const createPluginsResource = require('./plugins');

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
    crudmaker.create({ resource: createPluginsResource(dependencies), dependencies });
    server.listen(config.serverPort, () => logger.log(`server is listening on port ${config.serverPort}`));
  } catch (err) {
    logger.error(err.message || err.toString());
    setTimeout(startApp, config.serverInitIntervalMs);
  }
}

startApp();
