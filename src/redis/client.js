var redis = require('redis').createClient();
module.exports = redis;

/*
redis.on('connect', function() {
    console.log('redis connected');
});
*/