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
  
});