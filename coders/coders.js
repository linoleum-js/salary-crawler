var crawler = require('./crawler');
var result = crawler.crawl('angular');
var all = require('node-promise').all;
var fs = require('fs');

all([result]).then(function (data) {
  // var content = JSON.parse(data[0][0].body);
  var content = data;
  fs.writeFile(
    'coders-result.json',
    JSON.stringify(content, null, 4),
    // content,
    function (error) {
      if (error) console.log(error);
      console.log('finish');
    }
  );
});
