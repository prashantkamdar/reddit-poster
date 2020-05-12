const scnsrc = require('./scnsrc');

scnsrc.getPosts(function(err, result){
    if(!err){
        console.log(result);
    }
});