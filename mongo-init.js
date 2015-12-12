var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/salaries';
MongoClient.connect(url, function(err, db) {
  if (err) {
    console.log(err);
    return;
  }

  db.collection('clients').insertOne({
    data: 123
  }, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log(result);
    db.close();
  });
});
