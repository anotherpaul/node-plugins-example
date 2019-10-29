const { env } = process;

module.exports = {
  serverInitIntervalMs: parseInt(env.SERVER_INIT_INTERVAL_MS, 10) || 5000,
  serverPort: parseInt(env.SERVER_PORT, 10) || 8000,
  mongoConnectionString: env.MONGO_CONNECTION_STRING || 'mongodb://mongo:27017/test',
  redisConfig: JSON.parse(env.REDIS_CONFIG || '{ "port": 6379, "host": "redis" }'),
  newPluginChannel: env.NEW_PLUGIN_CHANNEL || 'new_plugin',
  newNpmPluginChannel: env.NEW_NPM_PLUGIN_CHANNEL || 'new_npm_plugin',
  filePath: '/uploads',
  installPath: '/packages',
};
