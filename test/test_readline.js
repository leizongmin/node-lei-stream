/**
 * lei-stream
 *
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var stream = require('../');
var should = require('should');

describe('ReadLineStream', function () {

  it('#1 autoNext=false', function (done) {

    var counter = 0;
    var s = stream.readLine(fs.createReadStream(path.resolve(__dirname, 'files/json_small.txt')));
    s.on('data', function (data) {
      counter++;
      s.next();
    });
    s.on('end', function () {
      counter.should.equal(93);
      done();
    });

  });

  it('#2 autoNext=true', function (done) {

    var counter = 0;
    var s = stream.readLine(fs.createReadStream(path.resolve(__dirname, 'files/json_small.txt')), {
      autoNext: true
    });
    s.on('data', function (data) {
      counter++;
    });
    s.on('end', function () {
      counter.should.equal(93);
      done();
    });

  });

  it('#3 big file, autoNext=false', function (done) {

    var counter = 0;
    var s = stream.readLine(fs.createReadStream(path.resolve(__dirname, 'files/json_big.txt')));
    s.on('data', function (data) {
      counter++;
      s.next();
    });
    s.on('end', function () {
      counter.should.equal(7627);
      done();
    });

  });

  it('#4 big file, autoNext=true', function (done) {

    var counter = 0;
    var s = stream.readLine(fs.createReadStream(path.resolve(__dirname, 'files/json_big.txt')), {
      autoNext: true
    });
    s.on('data', function (data) {
      counter++;
    });
    s.on('end', function () {
      counter.should.equal(7627);
      done();
    });

  });

  it('#5 autoNext=true, custom encoding', function (done) {

    var counter = 0;
    var counter2 = 0;
    var s = stream.readLine(fs.createReadStream(path.resolve(__dirname, 'files/json_small.txt')), {
      autoNext: true,
      encoding: function (str) {
        counter2++;
        return str;
      }
    });
    s.on('data', function (data) {
      counter++;
    });
    s.on('end', function () {
      counter.should.equal(93);
      counter2.should.equal(93);
      done();
    });

  });

  it('#6 filename', function (done) {

    var counter = 0;
    var s = stream.readLine(path.resolve(__dirname, 'files/json_small.txt'));
    s.on('data', function (data) {
      counter++;
      s.next();
    });
    s.on('end', function () {
      counter.should.equal(93);
      done();
    });

  });

  it('#7 simple', function (done) {

    var counter = 0;
    stream.readLine(path.resolve(__dirname, 'files/json_small.txt')).go(function (data, next) {
      counter++;
      next();
    }, function () {
      counter.should.equal(93);
      done();
    });

  });

});