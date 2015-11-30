var crawl = function (query) {
  var Crawler = require('crawler');
  var util = require('util');
  var fs = require('fs');
  var Promise = require('node-promise').Promise;

  var baseUrl = 'https://www.upwork.com/o/profiles/browse/api/search';
  var headers = {
    'x-requested-with': 'XMLHttpRequest',
    'x-xsrf-token': 'b61c135df10b5f6dc5ea39e0aeea695b'
  };
  var baseUrlWithQuery = baseUrl + '?q=' + query;

  var promise = new Promise();
  var data = [];
  var urlsCiphers = [];

  var crawler = new Crawler({
    callback: function (error, result) {
      var list = result.body.match(
        /\/o\\\/profiles\\\/users\\\/([^\/]*)\//g
      );

      urlsCiphers = urlsCiphers.concat(list.map(function (item) {
        return item.slice(21, -2);
      }));
    },

    onDrain: function () {
      itemCrawler.queue(urlsCiphers.map(function (item) {
        return {
          headers: headers,
          uri: 'https://www.upwork.com/freelancers/' + item
        };
      }).pop());
    }
  });

  crawler.queue({
    headers: headers,
    uri: baseUrlWithQuery + '&page=1'
  });

  var itemCrawler = new Crawler({
    callback: function (error, result) {
      data = result;
    },

    onDrain: function () {
      promise.resolve(data);
    }
  });

  return promise;
};

module.exports.crawl = crawl;
