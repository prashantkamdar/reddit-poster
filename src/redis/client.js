var redis = require('redis').createClient({host: '127.0.0.1', port: 6379});
module.exports = redis;


redis.on('connect', function() {
    console.log('redis connected');
});