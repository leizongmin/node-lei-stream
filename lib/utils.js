/**
 * lei-stream
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var createDebug = require('debug');
var utils = module.exports = require('lei-utils').extend({});


/**
 * debug
 * 
 * @param {String} name
 * @return {Function}
 */
utils.debug = function (name) {
  return createDebug('lei:stream:' + name);
};

/**
 * parseJSON
 * 
 * @param {String} data
 * @return {Object}
 */
utils.parseJSON = function (data) {
  return JSON.parse(data.toString());
};
