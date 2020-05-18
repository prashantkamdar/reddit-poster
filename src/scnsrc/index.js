const request = require('request');
const cheerio = require('cheerio');
const redis = require('../redis');

url = 'https://www.scnsrc.me/page/';

let headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
    'Cookie': '__cfduid=d3f1c963948cd66bab6de1c6e0ec8e4141587982689; cf_clearance=c9d0462d0720ac241daaf5e778bceb9ea9ba532d-1587982706-0-150; MintAcceptsCookies=1; MintUnique=1; MintUniqueDay=1587963600; MintUniqueWeek=1587877200; MintUniqueMonth=1585717200; MintUniqueLocation=1; __cf_bm=8c9ef3b483f2543a77de506d51094626ffd5288d-1587987784-1800-AYlY8TpPBhTTJfz6Z84bOejRFTWSwJa1AZiGcuJCpcWMY3vBQhgTEKcZ3qjBySf+dHwDsGciwUSdnLpHUyYcig6DMB5tmt++4O8kbPwdsEff; MintUniqueHour=1587985200'
};

function something(options) {
    return new Promise((resolve, reject) => {
        request(options, async function(error, response, html) {
            if (!error && response.statusCode == 200) {

                let $ = cheerio.load(html);

                let allPosts = $("div[class='post']");

                for (let i = 0; i < allPosts.length; i++) {

                    post = allPosts[i];
                    persistenceResult = '';

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
                        await redis.setPost(name);
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
            url = url + pageNumber;

            let options = {
                url: url,
                headers: headers
            };

            existsCounter = await something(options);
            console.log("existsCounter: " + existsCounter + ", pageNumber: " + pageNumber);

        } while (existsCounter < 3 && pageNumber < 2)

        resolve(posts);

    });
}

module.exports.getPosts = getPosts;