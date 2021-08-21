const pino = require('pino');
const logger = pino(pino.destination({ dest: '/logs/logs'}));
module.exports = logger;