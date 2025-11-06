module.exports = {
  apps: [
    {
      name: 'neuralift-backend',
      script: 'index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
