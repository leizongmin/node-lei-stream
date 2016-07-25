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
const MAX_STACK_SIZE = 1000;

class ReadLineStream extends EventEmitter {

  /**
   * ReadLineStream
   *
   * @param {Object|String} stream
   * @param {Object} options
   * @returns {Object}
   */
  constructor(stream, options) {
    super();

    instanceCounter++;
    this._debug = utils.debug('ReadLineStream:#' + instanceCounter);
    this._debug('init');

    if (typeof stream === 'string') {
      this._debug('create read file stream: %s', stream);
      stream = fs.createReadStream(stream);
    }
    if (!stream) throw new Error('missing parameter `stream`');
    if (typeof stream.on !== 'function') return new Error('no method `on` on parameter `stream`');

    options = options || {};
    options.newline = options.newline || '\n';
    options.autoNext = !!options.autoNext;
    options.encoding = utils.getDecodingFunction(options.encoding);

    this._options = options;
    this._stream = stream;
    this._buffer = new Buffer(0);
    this._lines = 0;
    this._ended = false;
    this._waitNext = false;
    this._nextRecurCounter = 0;

    stream.on('data', (chunk) => {
      this._debug('stream on data: %s bytes', chunk.length);
      this._onData(chunk);
    });
    stream.on('end', () => {
      this._debug('stream on end');
      this._ended = true;
      this.next();
    });
    stream.on('error', (err) => {
      this.emit('error', err);
    });
  }

  _onData(chunk) {
    this._stream.pause();
    this._buffer = Buffer.concat([this._buffer, chunk]);
    if (this._lines < 1) return this.next();
    if (this._options.autoNext) return this.next();
    if (this._waitNext) {
      this._waitNext = false;
      return this.next();
    }
  }

  /**
   * 读取下一行
   */
  next() {
    this._debug('next');
    if (this._ended && this._buffer.length < 1) {
      if (!this._emittedEnd) {
        this._emittedEnd = true;
        this.emit('end');
      }
      return ;
    }

    this._nextRecurCounter++;
    if (this._nextRecurCounter >= MAX_STACK_SIZE) {
      this._nextRecurCounter = 0;
      process.nextTick(() => {
        this.next();
      });
      return;
    }

    let i = this._buffer.indexOf(this._options.newline);
    if (i === -1) {
      if (!this._ended) {
        this._debug('only %s bytes, not enough buffer, resume stream', this._buffer.length);
        this._waitNext = true;
        return this._stream.resume();
      }
      this._debug('stream is ended, last buffer: %s', this._buffer);
      i = this._buffer.length;
    }

    const str = this._buffer.slice(0, i).toString();
    let data;
    this._buffer = this._buffer.slice(i + this._options.newline.length);
    this._lines++;
    this._debug('emit data: %s bytes', str.length);
    try {
      data = this._options.encoding(str)
    } catch (err) {
      this._debug('encoding fail: %s, data=%s', err, str);
      return this.emit('error', err, str);
    }
    this.emit('data', data);

    if (this._options.autoNext) {
      this.next();
    }
  }

  /**
   * 关闭
   */
  close() {
    this._debug('close');
    return this._stream.close();
  }

  /**
   * 开始读取
   *
   * @param {Function} onData
   * @param {Function} onEnd
   */
  go(onData, onEnd) {
    const callback = (err) => {
      if (callback._isCalled) return this._debug('go(onData, onEnd) has been calbacked');
      callback._isCalled = true;
      onEnd && onEnd(err);
    };

    let counter = 0;
    const next = () => {
      counter++;
      if (counter > MAX_STACK_SIZE) {
        counter = 0;
        process.nextTick(() => this.next());
      } else {
        this.next();
      }
    };
    this.on('data', (data) => {
      onData.call(this, data, next, this);
    });
    this.once('end', callback);
    this.once('error', callback);
  }

}

module.exports = function (stream, options) {
  return new ReadLineStream(stream, options);
};
