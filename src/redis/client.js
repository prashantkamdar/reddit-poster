const logger = require('../logger');
var redis = require('redis').createClient({host: '127.0.0.1', port: 6379});
module.exports = redis;


redis.on('connect', function() {
    logger.info('redis connected');
});