(function () {
  'use strict';

  var strings = function (value) {
    return value && value.every && value.every(function (item) {
      return typeof item === 'string';
    });
  };

  /**
   * @param {object[]} data
   */
  fk.validateParam = function (data) {
    var errorMessage = '';

    data.forEach(function (item) {
      switch (data.spec) {
        case 'string':
          if (typeof data.value !== 'string') {
            errorMessage = 'Expected string but got ' + data.value;
          }
          break;

        case 'string+':
          if ((typeof data.value !== 'string') || !data.value) {
            errorMessage = 'Expected non empty string but got ' + data.value;
          }
          break;

        case 'strings':
          if (!strings(data.value)) {
            errorMessage = 'Expected array of strings but got ' + data.value;
          }
          break;

        case 'function':
          if (typeof data.value !== 'function') {
            errorMessage = 'Expected function gut got ' + data.value;
          }
          break;

        default:
          break;
      }

      if (errorMessage) {
        // stop on first error
        throw new Error(errorMessage);
      }
    });
  };
}());