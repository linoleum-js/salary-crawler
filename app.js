var UpworkCodersCrawler = require('./upwork-coders-crawler.js');
var db = require('./db.js');
var fs = require('fs');
var Promise = require('node-promise').Promise;
var all = require('node-promise').all;
var timer = require('./timer.js');

timer.start();

var promises = [];
var count = 0;

console.time('time');
fs.readFile('./keywords.json', 'utf8', function (error, data) {
  var keywords = JSON.parse(data);

  var crawl = function () {
    var key = keywords.pop();
    var upworkCodersCrawler = new UpworkCodersCrawler(key);

    upworkCodersCrawler.run().then(function (data) {
      db.saveCoder(key, data).then(function () {
        console.log('Writing finished', key);
        if (keywords.length) {
          crawl();
        } else {
          console.log('All writing finished');
          timer.stop();
        }
      });
    });
  };

  crawl();
});
