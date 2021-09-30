const logger = require('../logger');
const request = require('request');

uploadURL = 'https://api.imgur.com/3/image';

let headers = {
    'Authorization':'Client-ID ' + process.env.IMGURCLIENTID
};

function uploadImage (title, image){
    return new Promise(async (resolve, reject) => {

        var postForm = {
            image: image
        }

        let postOptions = {
            url: uploadURL,
            headers: headers,
            form: postForm,
            method: 'POST'
        };

        request(postOptions, async function(error, response) {
            if (error){
                logger.info("Unable to upload image for " + title);
                reject();
            }
            
            var imgurUploadData = JSON.parse(response.body);
            imgurUploadData = imgurUploadData["data"]["link"];
            logger.info("Image uploaded for " + title + " with URL " + imgurUploadData);

            resolve(imgurUploadData);
        });

    });
}

module.exports.uploadImage = uploadImage;