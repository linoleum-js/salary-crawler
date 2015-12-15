
var db = require('./db.js');
var fs = require('fs');
var timer = require('./timer.js');

var logPath = './out.log';
if (fs.existsSync(logPath)) {
  fs.unlinkSync(logPath);
}
var out = fs.openSync(logPath, 'a');

timer.start();

db.init(function (db) {
  var keywords = fs.readFileSync('./keywords.json', 'utf8');
  keywords = JSON.parse(keywords);

  keywords.forEach(function (key) {
    var collection = db.collection(key);
    var totalHours = 0;
    var sumOfAverage = 0;
    var totalEarned = 0;

    var totalHours10 = 0;
    var sumOfAverage10 = 0;

    collection.createIndex({ 'calculated.weightedAverage': -1 });
    var array = collection.find({}, {
      calculated: true
    })
    .sort({
      'calculated.weightedAverage': -1
    })
    .toArray(function (error, data) {
      console.log(error);
      var length = data.length;
      var doc;
      var oneTenth = Math.floor(length / 10);

      var totalAveragesCalc = function (doc) {
        totalHours += doc.calculated.totalHours;
        totalEarned += doc.calculated.totalEarned;
        if (!isNaN(doc.calculated.weightedAverage)) {
          sumOfAverage += doc.calculated.weightedAverage;
        }
      };

      var totalAveragesCalc10 = function (doc) {
        if (!isNaN(doc.calculated.weightedAverage)) {
          sumOfAverage10 +=
            doc.calculated.weightedAverage * doc.calculated.totalHours;
          totalHours10 += doc.calculated.totalHours;
        }
      };



      for (var i = 0; i < oneTenth; i++) {
        doc = data[i];
        totalAveragesCalc10(doc);
        totalAveragesCalc(doc);
      }

      for (var i = oneTenth; i < length; i++) {
        doc = data[i];
        totalAveragesCalc(doc);
      }


      fs.writeSync(
        out,
        key.toUpperCase() + '\n' +
        // '  totalHours:       ' + totalHours.toFixed(2) + 'hrs\n' +
        // '  average hours:    ' + (totalHours / length).toFixed(2) + 'hrs\n' +
        '  simple average:   $' + (sumOfAverage / length).toFixed(2) + '/hr\n' +
        '  weighted average: $' + (totalEarned / totalHours).toFixed(2) + '/hr\n' +
        '  top ten average:  $' + (sumOfAverage10 / totalHours10).toFixed(2) + '/hr\n\n'
      );

      timer.stop();
    });
  });
});
