module.exports = {
  apps: [
    {
      name: 'face',
      script: 'dist/main.js',
      instances: 'max',
      exec_mode: 'cluster',
      env_development: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
