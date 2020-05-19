const scnsrc = require('./scnsrc');
const reddit = require('./reddit')

scnsrc.getPosts()
    .then((posts) => {
        return reddit.post(posts);
    })
    .then(() => {
        console.log("All done");
    })
    .catch((error) => {
        console.log('Error:', error);
    });