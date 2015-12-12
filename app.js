var UpworkCodersCrawler = require('./upwork-coders-crawler.js');
var db = require('./db.js');

var upworkCodersCrawler = new UpworkCodersCrawler('php');

upworkCodersCrawler.run().then(function (data) {
  db.saveProjects(data).then(function (data) {
    console.log(data);
  });
});
