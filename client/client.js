var crawler = require('./crawler');
var calculator = require('./calculator');
var all = require('node-promise').all;
var fs = require('fs');

var keywords = fs.readFileSync('keywords.json');
keywords = JSON.parse(keywords).slice(0, 1);

var crawlings = [];
var computings = [];

var dateFormat = function () {
  return new Date().toISOString().replace(/T.*/, '').replace(/\-/g, '.');
};

var compute = function () {
  console.log('Computing started');
  keywords.forEach(function (keyword) {
    computings.push(calculator.compute(keyword));
  });

  all(computings).then(function (data) {
    console.log('Computing finished');
    var content = data.map(function (item) {
      return item.content;
    });
    var dataStr = content.join("\n");
    console.log("\n" + dataStr + "\n");

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

    fs.writeFile('clients-results.txt', dataStr, function (error) {
      if (error) console.log(error);
    });

    fs.writeFile(
      'clients-results.json',
      JSON.stringify(data, null, 4),
      function (error) { if (error) console.log(error); }
    );
  });
};

console.log('Crawling started');

keywords.forEach(function (keyword) {
  crawlings.push(crawler.crawl(keyword));
});

all(crawlings).then(function () {
  console.log('Crawling finished');
  compute();
});
