const request = require('request');
const redis = require('../redis');

postURL = 'https://oauth.reddit.com/api/submit';
tokenURL = 'https://www.reddit.com/api/v1/access_token';

var postHeaders = {
    'User-Agent': 'scnsrc-poster/0.1 by mrksaccount'
};

var postForm = {
    sr: 'scnsrc',
    kind: 'self',
    title: '',
    text: '',
    flair_id: ''
};

let flairs = {
    Music: "7ab9b580-8623-11ea-b75e-0e1a7bd21f19",
    TV: "819bcb4a-8623-11ea-b1ce-0e04e2c11711",
    Movies: "b1fdb1cc-8623-11ea-8daa-0eed5f094bd5",
    eBooks: "c31f9de4-8623-11ea-8db4-0e7676c39295",
    FLAC: "e28a4594-8623-11ea-8b88-0e431b0aa83b",
    Games: "d74a102c-8af8-11ea-96aa-0ea9c4b7f435",
    Applications: "e88d8c6a-8af8-11ea-b848-0ec29a19e18d"
};

function something(options, title){
    return new Promise((resolve, reject) => {
        request(options, async function(error, response, body) {
            if(error){
                console.log("Error posting on reddit: " + error);
                resolve();
            } else if (response.statusCode != 200) {
                console.log("Bad response code posting on reddit: " + response.statusCode);
                resolve();
            } else {
                var jsonBody = JSON.parse(body);
                var postResult = jsonBody["success"];
                if(!postResult){
                    console.log("Reddit post error: " + JSON.stringify(jsonBody))
                } else {
                    console.log("Successfully posted: " + title);
                    await redis.setPost(title);
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
                console.log("Error getting token: " + error);
                reject();
            } else if (response.statusCode != 200) {
                console.log("Bad response code getting token: " + response.statusCode);
                reject();
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
        }

        posts = posts.reverse();
        
        for (let i = 0; i < posts.length; i++) {

            title = postForm["title"] = posts[i]["name"];
            postForm["text"] = posts[i]["titles"].join("\n\n");
            postForm["flair_id"] = "";
            
            var tags = posts[i]["tags"];
            var x = tags.filter(element => flairs[element] != undefined);
            if(x[0]){
                postForm["flair_id"] = flairs[x[0]]
            } else {                
                console.log("No flair found");
            }           

            let postOptions = {
                url: postURL,
                headers: postHeaders,
                form: postForm,
                method: 'POST'
            };

            await something(postOptions, title);
        }

        resolve();
    });
}

module.exports.post = post;