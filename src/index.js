const scnsrc = require('./scnsrc');
const reddit = require('./reddit');
require('dotenv').config();

/*
setInterval(function(){
    console.log("Started execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));

    scnsrc.getPosts()
    .then((posts) => {
        return reddit.post(posts);
    })
    .then(() => {
        console.log("Ended execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));
    })
    .catch((error) => {
        console.log('Error:', error);
    });
}, 60000);
*/

//3660000 61minutes

console.log("Started execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));
scnsrc.getPosts()
.then((posts) => {
    return reddit.post(posts);
})
.then(() => {
    console.log("Ended execution: " + (new Date(Date.now() + 19800000).toISOString().replace(/T/, ' ').replace(/\..+/, '')));
})
.catch((error) => {
    console.log('Error:', error);
});