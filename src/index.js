const scnsrc = require('./scnsrc');

scnsrc.getPosts()
    .then((data) => {console.log(data); process.exit();})
    .catch((error) => {console.log('Error:', error);});