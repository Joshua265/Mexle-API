module.exports = {
  apps: [
    {
      name: 'Mexle-Api',
      script: 'app.js',
      instances: 4,
      watch: '.',
      autorestart: true,
      watch: true
    }
  ],

  deploy: {
    production: {
      user: 'SSH_USERNAME',
      host: 'SSH_HOSTMACHINE',
      ref: 'origin/master',
      repo: 'GIT_REPOSITORY',
      path: 'DESTINATION_PATH',
      'pre-deploy-local': '',
      'post-deploy':
        'npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
