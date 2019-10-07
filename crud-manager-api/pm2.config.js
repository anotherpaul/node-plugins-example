const instanceCount = parseInt(process.env.SERVER_INSTANCE_COUNT, 10) || 2;

module.exports = {
  apps: [
    {
      name: 'crud-manager-api',
      script: './src/index.js',
      instances: instanceCount,
      exec_mode: 'cluster',
    },
  ],
};
