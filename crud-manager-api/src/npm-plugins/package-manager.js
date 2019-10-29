const fs = require('fs-extra');
const path = require('path');
const originalNpm = require('npm');
const { exec } = require('child_process');
const { promisify } = require('util');
const createNpmPromise = require('./npm-promise');

function createPackageManager({ logger, config }) {
  const npm = createNpmPromise({ npm: originalNpm, exec: promisify(exec), config });

  function loadPackage(packageName) {
    const packagePath = path.join(config.installPath, 'node_modules', packageName);
    logger.log('loading', packageName, 'from', packagePath);
    const { info, loadedPackage } = npm.requirePackage(packagePath);

    return {
      name: packageName,
      version: info.version,
      path: packagePath,
      packageUrl: info._from,
      loadedPackage,
    };
  }

  async function install(packageName, packageUrl) {
    logger.log('installing', packageName, 'from', packageUrl);
    try {
      await npm.install(packageUrl);
      return packageName;
    } catch (err) {
      logger.error(`error installing package ${packageName}, ${err}`);
      throw Error(`error installing package ${packageName}, ${err}`);
    }
  }

  async function init() {
    const targetPath = path.join(config.installPath, 'package.json');
    const packageJsonExists = await fs.pathExists(targetPath);
    if (!packageJsonExists) {
      logger.log('first run, creating package.json');
      await fs.copy(config.templatePath, targetPath);
    }
    await npm.load();
    const { dependencies } = await npm.list();
    Object.entries(dependencies).forEach(([id]) => loadPackage(id));
  }

  return {
    install,
    init,
    loadPackage,
  };
}

module.exports = createPackageManager;
