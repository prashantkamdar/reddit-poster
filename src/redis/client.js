var redis = require('redis').createClient({host: 'redis-server', port: 6379});
module.exports = redis;

/*
redis.on('connect', function() {
    console.log('redis connected');
});
*/