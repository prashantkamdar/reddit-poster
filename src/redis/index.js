const redisClient = require('./client');

let postExists = function(postName) {
    return new Promise((resolve, reject) => {
        redisClient.exists(postName, function(err, reply) {
            if (!err) {
                if (reply === 1) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                reject(err);
            }
        });
    });
};

let setPost = function(postName) {
    return new Promise((resolve, reject) => {
        redisClient.set(postName, new Date().toLocaleString('sv', {
            timeZoneName: 'short'
        }), function(err, reply) {
            if (!err) {
                resolve(true);
            } else {
                reject(err);
            }
        });
    });
};

module.exports.postExists = postExists;
module.exports.setPost = setPost;