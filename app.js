var upwork = require('./upwork');
var computer = require('./computer');
var all = require('node-promise').all;
var fs = require('fs');

var keywords = [
  'php',
  'ruby',
  'rails',
  'angular',
  'django',
  'python',
  'laravel',
  'react',
  'backbone',
  'javascript',
  'frontend',
  'node.js',
  'android',
  'java',
  'c++',
  'asp.net',
  'wordpress'
];

var crawlings = [];
var computings = [];

var dateFormat = function () {
  return new Date().toISOString().replace(/T.*/, '').replace(/\-/g, '.');
};

var compute = function () {
  console.log('Computing started');
  keywords.forEach(function (keyword) {
    computings.push(computer.compute(keyword));
  });

  all(computings).then(function (data) {
    console.log('Computing finished');
    var content = data.map(function (item) {
      return item.content;
    });
    var dataStr = content.join("\n");
    console.log("\n" + dataStr + "\n");

    console.log(data);

    var avrg = data.reduce(function (sum, item) {
      return sum + item.avrg;
    }, 0) / data.length;

    var topTen = data.reduce(function (sum, item) {
      return sum + item.topTen;
    }, 0) / data.length;

    var header = 'Upwork salary statistics ' + dateFormat() + "\n\n";
    header += 'Industry average:         $' + avrg.toFixed(2) + "/hr\n";
    header += 'Industry top ten average: $' + topTen.toFixed(2) + "/hr\n\n\n";

    dataStr = header + dataStr;

    fs.writeFile('./data/results.txt', dataStr, function (error) {
      if (error) {
        console.log(error);
      }
    });
  });
};

console.log('Crawling started');

keywords.forEach(function (keyword) {
  crawlings.push(upwork.crawl(keyword));
});

all(crawlings).then(function () {
  console.log('Crawling finished');
  compute();
});
