var Crawler = require("crawler");
var util = require('util');

var baseUrl = 'https://www.upwork.com/o/jobs/browse/url';
var baseQuery = 'duration=months,ongoing&workload=full_time&t=0';
var baseUrlWithQuery = baseUrl + '?' + baseQuery;

var urlsCiphers = [];
var data = [];

var total;

var crawler = new Crawler({
  callback: function (error, result, $) {
    if (error) {
      console.log(error);
      return;
    }

    result = JSON.parse(result.body);
    total = result.searchResults.paging.total;
    result.searchResults.jobs.forEach(function (item) {
      urlsCiphers.push('https://www.upwork.com/o/jobs/job/_' + item.ciphertext);
    });
  },

  onDrain: function () {
    itemCrawler.queue(urlsCiphers);
  }
});

var itemCrawler = new Crawler({
  callback: function (error, result, $) {
    var line = $('.m-lg-top.m-lg-bottom');
    var wrap = line.parent();
    var textChunks = wrap.find('.m-md-bottom');
    var texts = [];

    if (textChunks.length < 8) { return; }

    textChunks.each(function (i, item) {
      texts.push($(item));
    });
    var rate = texts.pop();
    var total = texts.pop();

    var totalText = total.find('strong').text();
    /\$([\d\,]+)\s/.exec(totalText);
    totalText = +RegExp.$1.replace(',', '');

    var rateText = rate.find('strong').text();
    /\$(.*)\//.exec(rateText);
    rateText = +RegExp.$1.replace(',', '.');

    var hours = rate.find('.text-muted').text();
    /([\d\,]+)/.exec(hours);
    hours = +RegExp.$1.replace(',', '.');

    var dataItem = {
      total: totalText,
      rate: rateText,
      hours: hours,
      url: result.uri
    };

    data.push(dataItem);
  },

  onDrain: function () {
    console.log(util.inspect(data));
    console.timeEnd('time');
  }
});

var runCrawler = function () {
  var pageNumber = Math.ceil(total / 10);
  var maxPages = 5;
  pageNumber = pageNumber > maxPages ? maxPages : pageNumber;
  var queueList = [];

  for (var i = 1; i < pageNumber; i++) {
    queueList.push(baseUrlWithQuery + '&q=php&page=' + (i + 1));
  }

  crawler.queue(queueList);
};

console.time('time');

crawler.queue({
  uri: baseUrlWithQuery + '&page=1&q=php',
  callback: function (error, result) {
    if (error) {
      console.log(error);
      return;
    }

    result = JSON.parse(result.body);
    total = result.searchResults.paging.total;
    result.searchResults.jobs.forEach(function (item) {
      urlsCiphers.push('https://www.upwork.com/o/jobs/job/_' + item.ciphertext);
    });

    runCrawler();
  }
});
