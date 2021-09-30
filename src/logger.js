const pino = require('pino');
//const logger = pino(pino.destination({ dest: '/logs/logs'}));
const logger = pino();
module.exports = logger;