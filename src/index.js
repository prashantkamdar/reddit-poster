require('dotenv').config();
const reddit = require('./reddit');
const newsblur = require('./newsblur');
const logger = require('./logger');

setInterval(function(){
    logger.info("Started execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));

    newsblur.getPosts()
    .then((posts) => {
        return reddit.post(posts);
    })
    .then(() => {
        logger.info("Ended execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));
    })
    .catch((error) => {
        logger.error('Error:', error);
    });
}, 3660000);


//3660000 61minutes

// logger.info("Started execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));

// newsblur.getPosts()
// .then((posts) => {
//     return reddit.post(posts);
// })
// .then(() => {
//     logger.info("Ended execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));
// })
// .catch((error) => {
//     logger.info('Error:', error);
// });