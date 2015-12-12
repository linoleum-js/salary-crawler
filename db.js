var MongoClient = require('mongodb').MongoClient;
var Promise = require('node-promise').Promise;

var url = 'mongodb://localhost:27017/salaries';

module.exports.saveProjects = function (data) {
  var promise = new Promise();

  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return;
    }

    db.collection('projects').insert(data, function (error, result) {
      if (error) {
        console.log(error);
        return;
      }
      promise.resolve(result);
    });
  });

  return promise;
};
