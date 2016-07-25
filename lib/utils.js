'use strict';

/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const createDebug = require('debug');
const utils = module.exports = require('lei-utils').extend();


/**
 * debug
 *
 * @param {String} name
 * @returns {Function}
 */
utils.debug = function (name) {
  return createDebug('lei:stream:' + name);
};

/**
 * jsonDecode
 *
 * @param {String} data
 * @returns {Object}
 */
utils.jsonDecode = function (data) {
  return JSON.parse(data.toString());
};

/**
 * base64Decode
 *
 * @param {String} data
 * @returns {Object}
 */
utils.base64Decode = function (data) {
  return new Buffer(data, 'base64').toString();
};

/**
 * getDecodingFunction
 *
 * @param {String} type
 * @returns {Function}
 */
utils.getDecodingFunction = function (type) {
  if (!type) return function (data) { return data; };
  if (typeof type === 'function') return type;
  if (type === 'json') return utils.jsonDecode;
  if (type === 'base64') return utils.base64Decode;
  throw new Error('not support deconding type `' + type + '`');
};

/**
 * jsonEncode
 *
 * @param {String} data
 * @returns {Object}
 */
utils.jsonEncode = function (data) {
  return JSON.stringify(data);
};

/**
 * base64Encode
 *
 * @param {String} data
 * @returns {Object}
 */
utils.base64Encode = function (data) {
  return new Buffer(data).toString('base64');
};

/**
 * getEncodingFunction
 *
 * @param {String} type
 * @returns {Function}
 */
utils.getEncodingFunction = function (type) {
  if (!type) return function (data) { return data; };
  if (typeof type === 'function') return type;
  if (type === 'json') return utils.jsonEncode;
  if (type === 'base64') return utils.base64Encode;
  throw new Error('not support enonding type `' + type + '`');
};
