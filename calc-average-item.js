
var db = require('./db.js');
var fs = require('fs');
var timer = require('./timer.js');

timer.start();

db.init(function (db) {
  var collection = db.collection('grails');
  var data = collection.find();

  data.each(function (error, doc) {
    // console.log(doc);
    if (!doc) {
      console.log('finish');
      timer.stop();
      db.close();
      return;
    }

    var jobs = doc.assignments;

    var average = jobs.reduce(function (sum, item) {
      return sum + item.hourlyRate.amount;
    }, 0) / jobs.length;

    var totalHours = jobs.reduce(function (sum, item) {
      return sum + item.totalHours;
    }, 0);

    var totalEarned = jobs.reduce(function (sum, item) {
      return sum + item.totalHours * item.hourlyRate.amount;
    }, 0);

    var weightedAverage = totalEarned / totalHours;

    collection.update(
      {
        _id: doc._id
      },
      {
        $set: {
          calculated: {
            average: average,
            weightedAverage: weightedAverage,
            totalHours: totalHours,
            totalEarned: totalEarned
          }
        }
      }
    );
  });
});
