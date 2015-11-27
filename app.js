var upwork = require('./upwork');
var computer = require('./computer');
var all = require('node-promise').all;
var fs = require('fs');

var keywords = ['php', 'ruby', 'rails', 'angular', 'django', 'python'];
var crawlings = [];
var computings = [];

var compute = function () {
  console.log('Computing started');
  keywords.forEach(function (keyword) {
    computings.push(computer.compute(keyword));
  });

  all(computings).then(function (data) {
    console.log('Computing finished');
    console.log("\n" + data.join("\n") + "\n");
    fs.writeFile('./data/results.txt', data.join("\n"), function (error) {
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
