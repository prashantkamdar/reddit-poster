const redisClient = require('./client');
const logger = require('../logger');

let postExists = function(hash) {
    return new Promise((resolve, reject) => {
        redisClient.exists(hash, function(err, reply) {
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

let setPost = function(hash) {
    return new Promise((resolve, reject) => {
        redisClient.set(hash, (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')), function(err, reply) {
            if (!err) {
                resolve(true);
                logger.info("Hash set in redis: " + hash);
            } else {
                reject(err);
                logger.error("Hash not set in redis: " + hash);
            }
        });
    });
};

module.exports.postExists = postExists;
module.exports.setPost = setPost;