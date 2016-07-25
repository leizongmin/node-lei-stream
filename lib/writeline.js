'use strict';

/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const EventEmitter = require('events').EventEmitter;
const utils = require('./utils');

let instanceCounter = 0;

class WriteLineStream extends EventEmitter {

  /**
   * WriteLineStream
   *
   * @param {Object|String} stream
   * @param {Object} options
   * @returns {Object}
   */
  constructor(stream, options) {
    super();

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

    stream.on('error', (err) => {
      this.emit('error', err);
    });
  }

  /**
   * 写数据
   *
   * @param {*} data
   * @param {Function} callback
   * @returns {boolean|*}
   */
  write(data, callback) {
    let str;
    try {
      str = this._options.encoding(data) + this._options.newline;
    } catch (err) {
      this._debug('encoding fail: %s, data=%s', err, data);
      return this.emit('error', err, data);
    }
    this._debug('write %s bytes', str.length);
    this._lines++;
    this._writeMethod(str, callback);
  }

  _writeNow(str, callback) {
    this._stream.write(str, callback);
  }

  _writeCache(str, callback) {
    this._cache.push(str);
    if (this._cache.length >= this._options.cacheLines) {
      this.flush(callback);
    } else {
      return callback && callback();
    }
  }

  /**
   * 将缓冲的数据写入目标
   *
   * @param {Function} callback
   * @returns {*}
   */
  flush(callback) {
    if (this._cache.length < 1) return callback && callback();
    this._debug('flush %s lines', this._cache.length);
    const str = this._cache.join('');
    this._cache = [];
    this._stream.write(str, callback);
  }

  /**
   * 结束
   *
   * @param {Function} callback
   */
  end(callback) {
    this.flush(() => {
      this._debug('end');
      return this._stream.end(callback);
    });
  }

}

module.exports = function (stream, options) {
  return new WriteLineStream(stream, options);
};
