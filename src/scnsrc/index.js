const request = require('request');
const cheerio = require('cheerio');
const redis = require('../redis');

baseURL = 'https://www.scnsrc.me/page/';

let headers = {
    'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
    'Accept':'text/html, */*; q=0.01',
    'Accept-Language':'en-US,en;q=0.5',
    'Referer':'https//www.scnsrc.me/',
    'X-Requested-With':'XMLHttpRequest',
    'DNT':'1',
    'Connection':'keep-alive',
    'Cookie':'__cf_bm=0c8ec6e0dcf6a4fee611333e6bfcc7765eed13da-1629530850-1800-ARQabev26CfizgH+Vc12y9hxLcW62elYyCCQzXfeTnY8gNQ7f/3OrLKVqT27QUQB7ErLZOQ661I2QqWMsY3HQg4=; MintAcceptsCookies=1; MintUnique=1; MintUniqueDay=1629518400; MintUniqueWeek=1629000000; MintUniqueMonth=1627790400; MintUniqueLocation=1; infiniteScroll=auto; MintUniqueHour=1629529200; MintCrush=379937858',
    'Sec-Fetch-Dest':'empty',
    'Sec-Fetch-Mode':'cors',
    'Sec-Fetch-Site':'same-origin',
    'TE':'trailers'
};

function something(options) {
    return new Promise((resolve, reject) => {
        request(options, async function(error, response, html) {
            if (!error && response.statusCode == 200) {

                let $ = cheerio.load(html);

                let allPosts = $("div[class='post']");

                for (let i = 0; i < allPosts.length; i++) {

                    post = allPosts[i];
                    
                    name = '';
                    tags = '';

                    name = $("h2 a", post).text();

                    tags = $("a[rel='category tag']", post).toArray().map(element => $(element).text());

                    titles = $("p > strong", post)
                        .filter(function() {
                            return $(this).text().indexOf(':') === -1;
                        })
                        .toArray()
                        .map(element => $(element).text());

                    let postExists = await redis.postExists(name);

                    if (!postExists) {
                        existsCounter = 0; //to find consecutive existing posts
                        posts.push({
                            "name": name,
                            "tags": tags,
                            "titles": titles
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

            existsCounter = await something(options);
            console.log("existsCounter: " + existsCounter + ", pageNumber: " + pageNumber + ", posts.length: " + posts.length);

        } while (existsCounter < 3 && pageNumber < 2)

        resolve(posts);
    });
}

module.exports.getPosts = getPosts;