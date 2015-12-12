
var db = require('./db.js');
var fs = require('fs');

db.get('javascript', function (data) {
  data.limit(20).each(function (error, doc) {
    if (!doc) { return; }

    var jobs = doc.assignments.filter(function (item) {
      return item.totalHours && item.hourlyRate;
    });

    console.log(jobs);

    var average = jobs.reduce(function (sum, item) {
      return sum + item.hourlyRate.amount;
    }, 0) / jobs.length;

    var totalHours = jobs.reduce(function (sum, item) {
      return sum + item.totalHours;
    }, 0);

    var weightedAverage = jobs.reduce(function (sum, item) {
      return sum + item.totalHours * item.hourlyRate.amount;
    }, 0) / totalHours;

    console.log('average', average);
    console.log('weightedAverage', weightedAverage);
  });
});
