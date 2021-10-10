const request = require('request');
const redis = require('../redis');
const logger = require('../logger');
const imgur = require('../imgur');

let postURL = 'https://oauth.reddit.com/api/submit';
let tokenURL = 'https://www.reddit.com/api/v1/access_token';

var postHeaders = {
    'User-Agent': 'scnsrc-poster/0.1 by mrksaccount'
};

var postForm = {
    sr: 'scnsrc',
    kind: '',
    title: '',
    text: '',
    flair_id: '',
    url: ''
};

let flairs = {
    music: "7ab9b580-8623-11ea-b75e-0e1a7bd21f19",
    tv: "819bcb4a-8623-11ea-b1ce-0e04e2c11711",
    movies: "b1fdb1cc-8623-11ea-8daa-0eed5f094bd5",
    ebooks: "c31f9de4-8623-11ea-8db4-0e7676c39295",
    flac: "e28a4594-8623-11ea-8b88-0e431b0aa83b",
    games: "d74a102c-8af8-11ea-96aa-0ea9c4b7f435",
    applications: "e88d8c6a-8af8-11ea-b848-0ec29a19e18d"
};

function postToReddit(options, hash){
    return new Promise((resolve, reject) => {
        request(options, async function(error, response, body) {
            if(error){
                logger.error("Error posting on reddit: " + error);
                resolve();
            } else if (response.statusCode != 200) {
                logger.error("Bad response code posting on reddit: " + response.statusCode);
                resolve();
            } else {
                var jsonBody = JSON.parse(body);
                var postResult = jsonBody["success"];
                if(!postResult){
                    logger.error("Reddit post error: " + JSON.stringify(jsonBody))
                } else {
                    logger.info("Successfully posted");
                    await redis.setPost(hash);
                    resolve();
                }
            }
        });
    });
}

function newToken(){
    return new Promise((resolve, reject) => {
       
        let tokenOptions = {
            url: tokenURL,
            headers: {'Authorization': 'Basic ' + process.env.APPHASH},
            form: {grant_type: 'password', username: process.env.REDDITUSERNAME, password: process.env.REDDITPASSWORD},
            method: 'POST'
        };

        request(tokenOptions, function(error, response, body) {
            if(error){
                logger.error("Error getting token: " + error);
                reject(error);
            } else if (response.statusCode != 200) {
                logger.error("Bad response code getting token: " + response.statusCode);
                reject("Non 200 response");
            } else {
                var jsonBody = JSON.parse(body);
                var token = jsonBody["access_token"];
                postHeaders["Authorization"] = "bearer " + token;
                resolve();
            }
        });
    });
}

let post = function(posts){
    return new Promise(async (resolve, reject) => {

        if(posts.length > 0){                    
            await newToken(); //get new token
            logger.info("Got the token")
        }

        posts = posts.reverse();
        
        for (let i = 0; i < posts.length; i++) {

            hash = posts[i]["hash"];
            image = posts[i]["image"];
            title = postForm["title"] = posts[i]["story_title"];            
            postForm["text"] = posts[i]["story_title"];
            postForm["flair_id"] = "";
            
            var tags = posts[i]["tags"];
            var x = tags.filter(element => flairs[element] != undefined);
            if(x[0]){
                postForm["flair_id"] = flairs[x[0]];
            } else {                
                logger.info("No flair found for post " + title + " with hash " + hash);
            }

            const imageURL = await imgur.uploadImage(title, image);

            if(imageURL){
                postForm["kind"] = "image";
                postForm["url"] = imageURL;

            } else {
                postForm["kind"] = "self";
            }

            let postOptions = {
                url: postURL,
                headers: postHeaders,
                form: postForm,
                method: 'POST'
            };

            logger.info("Trying to post: " + title);
            await postToReddit(postOptions, hash);
        }

        resolve();
    });
}

module.exports.post = post;