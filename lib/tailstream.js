'use strict';

/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const fs = require('fs');
const stream = require('stream');

class TailStream extends stream.Readable {

  /**
   * TailStream
   *
   * @param {Object} options
   *   - {String} file 文件名
   *   - {Number|String} position 位置，为"end"表示定位到尾部
   */
  constructor(options) {
    options = options || {};
    // 调用基类的构造函数
    super(options);
    // 文件名
    this._file = options.file;
    // 起始位置
    this._position = options.position || 0;
    // 标记是否准备就绪
    this._ready = false;
    // 开始打开文件
    this._openFile();
  }

  // 打开文件
  _openFile() {
    fs.open(this._file, 'r', (err, fd) => {
      if (err) return this.emit('error', err);
      this._fd = fd;

      const done = () => {
        // 定位完成后开始监听文件变化和尝试读取数据
        this._watchFile();
        this._ready = true;
        this._tryRead();
      };

      // 判断如果 this._position='end'则定位到文件尾部
      if (this._position === 'end') {
        this._goToEnd(done);
      } else {
        done();
      }
    });
  }

  // 监听文件内容变化
  _watchFile() {
    this._watcher = fs.watch(this._file, event => {
      if (event === 'change') {
        this._tryRead();
      }
    });
  }

  // 定位到文件尾部
  _goToEnd(callback) {
    fs.fstat(this._fd, (err, stats) => {
      if (err) return this.emit('error', err);
      // stats.size即为文件末尾的位置
      this._position = stats.size;
      callback();
    });
  }

  // 获取每次合适的读取字节数
  _getHighWaterMark() {
    return this._readableState.highWaterMark;
  }

  // 尝试读取数据
  _tryRead() {
    if (this._readableState.flowing) {
      // 仅当 flowing=true 时才读取数据
      this._read(this._getHighWaterMark());
    }
  }

  // 读取数据
  _read(size) {
    if (this._ready) {
      // 仅当_ready=true 时才尝试读取数据
      this._ready = false;
      fs.read(this._fd, new Buffer(size), 0, size, this._position,
        (err, bytesRead, buf) => {
          // 设置_ready=true 以便可以再次读取数据
          this._ready = true;
          if (err) return this.emit('error', err);
          if (bytesRead > 0) {
            // 将数据推送到队列
            this._position += bytesRead;
            this.push(buf.slice(0, bytesRead));
          }
        });
    }
  }

  // 关闭
  close() {
    // 关闭文件 watcher
    this._watcher.close();
    // 关闭文件操作句柄
    fs.close(this._fd, err => {
      if (err) return this.emit('error', err);
      // 结束 stream
      this.push(null);
    });
  }

}

module.exports = function (file, options) {
  const newOptions = Object.assign({}, options || {});
  newOptions.file = file;
  return new TailStream(newOptions);
};
