'use strict';

/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const path = require('path');
const fs = require('fs');
const stream = require('../');
const utils = require('lei-utils');
const should = require('should');

const BEGINNING_LENGTH = 1024 * 64;
const BLOCK_LINE_LENGTH = 1024;
const LINES_NUM = 10;
const WRITE_TIME = 50;

describe('TailStream', function () {

  it('read from file beginning', function (done) {

    const file = path.resolve(__dirname, 'files/write_3.log');
    try {
      fs.unlinkSync(file);
    } catch (err) {
      // console.log(err);
    }

    const beginning = utils.randomString(BEGINNING_LENGTH);
    fs.writeFileSync(file, beginning + '\n');

    const s = stream.tailStream(file);
    const blocks = [];
    s.on('data', data => blocks.push(data));

    // 模拟文件写入
    const newLines = [];
    for (let i = 0; i < LINES_NUM; i++) {
      const str = utils.randomString(BLOCK_LINE_LENGTH);
      newLines.push(str);
    }
    const s2 = stream.writeLine(fs.createWriteStream(file, {flags: 'a+'}));
    const writeNewLine = () => {
      const line = newLines.shift();
      if (line) {
        s2.write(line);
        setTimeout(writeNewLine, WRITE_TIME);
      } else {
        setTimeout(end, WRITE_TIME * 2);
      }
    };
    writeNewLine();

    function end() {
      s.close();
      s2.end();
      const fileContent = fs.readFileSync(file).toString();
      fileContent.should.equal(blocks.join(''));
      done();
    }

  });

  it('read from file ending', function (done) {

    const file = path.resolve(__dirname, 'files/write_4.log');
    try {
      fs.unlinkSync(file);
    } catch (err) {
      // console.log(err);
    }

    const beginning = utils.randomString(BEGINNING_LENGTH);
    fs.writeFileSync(file, beginning + '\n');

    const s = stream.tailStream(file, {position: 'end'});
    const blocks = [];
    s.on('data', data => blocks.push(data));

    // 模拟文件写入
    const newLines = [];
    for (let i = 0; i < LINES_NUM; i++) {
      const str = utils.randomString(BLOCK_LINE_LENGTH);
      newLines.push(str);
    }
    const s2 = stream.writeLine(fs.createWriteStream(file, {flags: 'a+'}));
    const writeNewLine = () => {
      const line = newLines.shift();
      if (line) {
        s2.write(line);
        setTimeout(writeNewLine, WRITE_TIME);
      } else {
        setTimeout(end, WRITE_TIME * 2);
      }
    };
    writeNewLine();

    function end() {
      s.close();
      s2.end();
      const fileContent = fs.readFileSync(file).toString();
      fileContent.slice(beginning.length + 1).should.equal(blocks.join(''));
      done();
    }

  });

});
