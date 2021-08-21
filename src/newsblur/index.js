const request = require('request');
const redis = require('../redis');
const logger = require('../logger');

baseURL = 'https://www.newsblur.com/reader/feed/'+ process.env.FEEDID + '?page=';

let headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0'
};

function getFromNewsBlur(options) {
    return new Promise((resolve, reject) => {
        request(options, async function(error, response) {
            if (!error && response.statusCode == 200) {
                
                logger.info(response.body);

                var feed = JSON.parse(response.body);
                var stories = feed.stories;

                for (let i = 0; i < stories.length; i++) {
                    story = stories[i];
                    hash = story.story_hash;
                    story_title = story.story_title;
                    tags = story.story_tags;

                    let postExists = await redis.postExists(hash);

                    if (!postExists) {
                        existsCounter = 0; //to find consecutive existing posts
                        posts.push({
                            "story_title": story_title,
                            "tags": tags,
                            "hash": hash
                        });
                    } else {
                        existsCounter++;
                    }
                }
                
            } else {
                reject(error);
            }
            resolve(existsCounter);
        });
    });
}

let getPosts = function() {
    return new Promise(async (resolve, reject) => {

        pageNumber = 0;
        existsCounter = 0;
        posts = [];

        do {
            pageNumber++;
            url = baseURL + pageNumber;

            let options = {
                url: url,
                headers: headers
            };

            existsCounter = await getFromNewsBlur(options);
            logger.info("existsCounter: " + existsCounter + ", pageNumber: " + pageNumber + ", posts.length: " + posts.length);

        } while (existsCounter < 3 && pageNumber < 2)

        resolve(posts);
    });
}

module.exports.getPosts = getPosts;