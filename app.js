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
  'node.js'
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
    var dataStr = data.join("\n");
    console.log("\n" + dataStr + "\n");

    dataStr = 'Upwork salary statistics ' + dateFormat() + "\n\n" + dataStr;
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
