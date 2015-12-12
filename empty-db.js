var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/salaries';

MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log(err);
    return;
  }

  db.collection('projects').remove();
});
