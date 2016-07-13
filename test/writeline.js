'use strict';

/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

const path = require('path');
const fs = require('fs');
const stream = require('../');
const should = require('should');

describe('WriteLineStream', function () {

  it('#1 write & read', function (done) {

    try {
      fs.unlinkSync(path.resolve(__dirname, 'files/write_1.log'));
    } catch (err) {}

    const s = stream.writeLine(path.resolve(__dirname, 'files/write_1.log'), {
      encoding: 'json'
    });
    for (let i = 0; i < 200; i++) {
      s.write({env: process.env, time: new Date()});
    }
    s.end(function () {

      stream.readLine(path.resolve(__dirname, 'files/write_1.log'), {
        encoding: 'json'
      }).go(function (data, next) {
        JSON.stringify(process.env).should.eql(JSON.stringify(data.env));
        next();
      }, done);

    });

  });

  it('#2 write & read (cache)', function (done) {

    try {
      fs.unlinkSync(path.resolve(__dirname, 'files/write_2.log'));
    } catch (err) {}

    const s = stream.writeLine(path.resolve(__dirname, 'files/write_2.log'), {
      encoding: 'json',
      cacheLines: 10
    });
    for (let i = 0; i < 200; i++) {
      s.write({env: process.env, time: new Date()});
    }
    s.end(function () {

      stream.readLine(path.resolve(__dirname, 'files/write_2.log'), {
        encoding: 'json'
      }).go(function (data, next) {
        JSON.stringify(process.env).should.eql(JSON.stringify(data.env));
        next();
      }, done);

    });

  });

});