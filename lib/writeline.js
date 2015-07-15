/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var fs = require('fs');
var utils = require('./utils');

var instanceCounter = 0;

/**
 * WriteLineStream
 *
 * @param {Object|String} stream
 * @param {Object} options
 * @return {Object}
 */
function WriteLineStream (stream, options) {
  if (!(this instanceof WriteLineStream)) return new WriteLineStream(stream, options);

  instanceCounter++;
  this._debug = utils.debug('WriteLineStream:#' + instanceCounter);
  this._debug('init');

  if (typeof stream === 'string') {
    this._debug('create write file stream: %s', stream);
    stream = fs.createWriteStream(stream);
  }
  if (!stream) throw new Error('missing parameter `stream`');
  if (typeof stream.write !== 'function') return new Error('no method `write` on parameter `stream`');

  options = options || {};
  options.newline = options.newline || '\n';
  options.encoding = utils.getEncodingFunction(options.encoding);
  options.cacheLines = options.cacheLines || 0;
  if (!(options.cacheLines > 0)) options.cacheLines = 0;

  this._options = options;
  this._stream = stream;
  this._lines = 0;
  this._cache = [];

  if (this._options.cacheLines > 0) {
    this._writeMethod = this._writeCache;
  } else {
    this._writeMethod = this._writeNow;
  }
}

utils.inheritsEventEmitter(WriteLineStream);

WriteLineStream.prototype.write = function (data, callback) {
  var str;
  try {
    str = this._options.encoding(data) + this._options.newline;
  } catch (err) {
    this._debug('encoding fail: %s, data=%s', err, data);
    return this.emit('error', err, data);
  }
  this._debug('write %s bytes', str.length);
  this._lines++;
  this._writeMethod(str, callback);
};

WriteLineStream.prototype._writeNow = function (str, callback) {
  this._stream.write(str, callback);
};

WriteLineStream.prototype._writeCache = function (str, callback) {
  this._cache.push(str);
  if (this._cache.length >= this._options.cacheLines) {
    this.flush(callback);
  } else {
    return callback && callback();
  }
};

WriteLineStream.prototype.flush = function (callback) {
  if (this._cache.length < 1) return callback && callback();
  this._debug('flush %s lines', this._cache.length);
  var str = this._cache.join('');
  this._cache = [];
  this._stream.write(str, callback);
};

WriteLineStream.prototype.end = function (callback) {
  var self = this;
  this.flush(function () {
    self._debug('end');
    return self._stream.end(callback);
  });
};



module.exports = WriteLineStream;
