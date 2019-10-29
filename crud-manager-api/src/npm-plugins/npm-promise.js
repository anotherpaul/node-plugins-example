/* eslint global-require: "off", import/no-dynamic-require: "off" */
const path = require('path');

function createNpmPromise({ npm, exec, config }) {
  function install(packageUrl) {
    return exec(`cd ${config.installPath} && npm install ${packageUrl}`);
  }

  function requirePackage(packagePath) {
    const loadedPackage = require(packagePath);
    const requirePath = path.join(packagePath, 'package.json');

    delete require.cache[require.resolve(requirePath)];

    return { loadedPackage, info: require(requirePath) };
  }

  function load() {
    return new Promise((resolve, reject) => {
      npm.load(config.npm, (err, data) => {
        if (err) {
          return reject(err);
        }
        npm.localPrefix = config.installPath; // eslint-disable-line no-param-reassign
        return resolve(data);
      });
    });
  }

  function list() {
    return new Promise((resolve, reject) => {
      npm.commands.list([], true, (err, data) => {
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  }

  return {
    install,
    requirePackage,
    load,
    list,
  };
}

module.exports = createNpmPromise;
