/**
 * lei-stream
 * 
 * @author Zongmin Lei <leizongmin@gmail.com>
 */

var path = require('path');
var fs = require('fs');
var stream = require('../');
var should = require('should');

describe('WriteLineStream', function () {
  
  it('#1 write & read', function (done) {
    
    try {
      fs.unlinkSync(path.resolve(__dirname, 'files/write_1.log'));
    } catch (err) {}
    
    var s = stream.writeLine(path.resolve(__dirname, 'files/write_1.log'), {
      encoding: 'json'
    });
    for (var i = 0; i < 200; i++) {
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
  
});