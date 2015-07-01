
(function () {
  'use strict';

  /**
   *
   * @param {string} name
   * @param {string[]} dependencies
   * @param {function} initializer
   */
  var model = function (name, dependencies, initializer) {
    this.name = name;
  };

  fk.Application.prototype.model = model;
}());