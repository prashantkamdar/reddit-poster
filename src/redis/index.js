const redisClient = require('./client');

let postExists = function(postName, callback) {
    redisClient.exists(postName, function(err, reply) {        
        if (!err) {
            if (reply === 1) {
                result = true;                
            } else {
                result = false;                
            }            
        }
        callback(null, result);
    });
};

let setPost = function(postName, callback) {
    redisClient.set(postName, new Date().toLocaleString( 'sv', { timeZoneName: 'short' } ), function(err, reply) {        
        if (!err) {
            callback(null, reply);
        } else {
            callback(err, null);
        }
    });
};


module.exports.postExists = postExists;
module.exports.setPost = setPost;