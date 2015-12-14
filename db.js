var MongoClient = require('mongodb').MongoClient;
var Promise = require('node-promise').Promise;

var url = 'mongodb://localhost:27017/salaries';

module.exports.saveCoder = function (keyword, data) {
  var promise = new Promise();

  MongoClient.connect(url, function(err, db) {
    if (err) {
      console.log(err);
      return;
    }

    db.collection(keyword).remove();
    db.collection(keyword).insert(data, function (error, result) {
      if (error) {
        console.log(error);
        return;
      }
      promise.resolve(result);
      db.close();
    });
  });

  return promise;
};

module.exports.init = function (callback) {
  MongoClient.connect(url, function (error, db) {
    if (error) {
      console.log(error);
      return;
    }

    callback(db);
  });
};
