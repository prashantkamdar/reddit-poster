const scnsrc = require('./scnsrc');

scnsrc.getPosts()
    .then((data) => {console.log(data);})
    .catch((error) => {console.log('Error:', error);});