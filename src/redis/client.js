const logger = require('../logger');
var redis = require('redis').createClient({host: 'redis', port: 6379});
module.exports = redis;


redis.on('connect', function() {
    logger.info('redis connected');
});