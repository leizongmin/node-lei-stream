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

  this._options = options;
  this._stream = stream;
  this._lines = 0;

}

utils.inheritsEventEmitter(WriteLineStream);

WriteLineStream.prototype.write = function (data, callback) {
  try {
    var str = this._options.encoding(data) + this._options.newline;
  } catch (err) {
    this._debug('encoding fail: %s, data=%s', err, data);
    return this.emit('error', err, data);
  }
  this._debug('write %s bytes', str.length);
  this._lines++;
  this._stream.write(str, callback);
};

WriteLineStream.prototype.end = function (callback) {
  this._debug('end');
  return this._stream.end(callback);
};



module.exports = WriteLineStream;
