/*
const request = require('request');
const cheerio = require('cheerio');

url = 'https://www.scnsrc.me/page/1/';

request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
        
        let $ = cheerio.load(html);

        $("div[class='post']").each(function(i,post){
            
            name = $("h2 a", post).text();
            console.log(name);

            tags = $("a[rel='category tag']", post).toArray().map(element => $(element).text());
            console.log(tags);

            titles = $("p > strong", post)
            .filter(function(){
                return $(this).text().indexOf(':') === -1;
            })
            .toArray()
            .map(element => $(element).text());

            console.log(titles);


            console.log("+-+-+-+-+-+-++-+-")
        })


    } else {
        console.log(error);
    }
});
*/

const scnsrc = require('./scnsrc');

var x = scnsrc.getPosts();
console.log(x);