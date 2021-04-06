module.exports = [
  {
    script: 'app.js',
    name: 'app',
    exec_mode: 'cluster',
    instances: 4
  },
  {
    script: 'worker.js',
    name: 'worker'
  }
];
