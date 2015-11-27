


var compute = function (query) {
  var Promise = require('node-promise').Promise;
  var fs = require('fs');

  var promise = new Promise();
  var filename = './data/upwork-' + query + '.json';

  console.log('Computing started: ' + query);

  fs.readFile(filename, 'utf-8', function (err, data) {
    data = JSON.parse(data);

    var rates = data
      .map(function (item) {
        return item.rate;
      })
      .sort(function (a, b) { return b - a; });

    var length = rates.length;
    var tenth = Math.round(length / 10);

    var avrg = rates.reduce(function (item, sum) {
      return sum + item;
    }) / length;

    var topTen = rates.slice(0, tenth).reduce(function (item, sum) {
      return item + sum;
    }) / tenth;

    var bottomTen = rates.slice(-tenth).reduce(function (item, sum) {
      return item / sum;
    }) / tenth;

    var content = 'Query: ' + query + "\n";
    content += 'Total jobs reviewed: ' + data.length + "\n";
    content += 'Average:            $' + avrg.toFixed(2) + "/hr\n";
    content += 'Top ten average:    $' + topTen.toFixed(2) + "/hr\n";
    content += 'Bottom ten average: $' + bottomTen.toFixed(2) + "/hr\n";


    promise.resolve(content);
    console.log('Computing finished: ' + query);
  });

  return promise;
};

module.exports.compute = compute;
