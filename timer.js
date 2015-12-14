
var timeStart;

var start = function () {
  timeStart = +new Date();
};


var stop = function () {
  var timeEnd = +new Date();
  var diffMs = timeEnd - timeStart;
  diff = diffMs / 1000;

  var hours = Math.floor(diff / 3600);
  var minutes = Math.floor((diff % 3600) / 60);
  var seconds = Math.floor(diff % 60);
  var ms = diffMs % 1000;

  if (hours < 10) hours = '0' + hours;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;
  if (ms < 10) ms = '00' + ms;
  else if (ms < 100) ms = '0' + ms;

  console.log(
    'elapsed time: ' +
    hours + ':' +
    minutes + ':' +
    seconds + ':' +
    ms
  );
};

module.exports.start = start;
module.exports.stop = stop;
