const request = require('request');
const cheerio = require('cheerio');

posts = [];

url = 'https://www.scnsrc.me/page/1/';

function getPosts(){

request(url, function(error, response, html) {
    if (!error && response.statusCode == 200) {
        
        let $ = cheerio.load(html);

        $("div[class='post']").each(function(i,post){
            
            name = $("h2 a", post).text();
            //console.log(name);

            tags = $("a[rel='category tag']", post).toArray().map(element => $(element).text());
            //console.log(tags);

            titles = $("p > strong", post)
            .filter(function(){
                return $(this).text().indexOf(':') === -1;
            })
            .toArray()
            .map(element => $(element).text());

            //console.log(titles);

            posts.push({"name":name, "tags":tags, "titles":titles});


            //console.log("+-+-+-+-+-+-++-+-")
        });

        return posts;


    } else {
        console.log(error);
    }
});
}

exports.getPosts = getPosts;