# lei-stream
Read/Write Stream

## 安装

```bash
npm install lei-stream --save
```

## readLine 按行读取流

使用方法1：

```javascript
var readLine = require('lei-stream').readLine;

readLine('./myfile.txt').go(function (data, next) {
  console.log(data);
  next();
}, function () {
  console.log('end');
});
```

使用方法2：

```javascript
var fs = require('fs');
var readLine = require('lei-stream').readLine;

// readLineStream第一个参数为ReadStream实例，也可以为文件名
var s = readLine(fs.createReadStream('./myfile.txt'), {
  // 换行符，默认\n
  newline: '\n',
  // 是否自动读取下一行，默认false
  autoNext: false,
  // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
  encoding: function (data) {
    return JSON.parse(data);
  }
});

// 读取到一行数据时触发data事件
s.on('data', function (data) {
  console.log(data);
  s.next();
});

// 流结束时触发end事件
s.on('end', function () {
  console.log('end');
});
```

## writeLine

按行写流

```javascript
var fs = require('fs');
var writeLineStream = require('lei-stream').writeLine;

// writeLineStream第一个参数为ReadStream实例，也可以为文件名
var s = writeLineStream(fs.createWriteStream('./myfile.txt'), {
  // 换行符，默认\n
  newline: '\n',
  // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
  encoding: function (data) {
    return JSON.stringify(data);
  },
  // 缓存的行数，默认为0（表示不缓存），此选项主要用于优化写文件性能，当数量缓存的内容超过该数量时再一次性写入到流中，可以提高写速度
  cacheLines: 0
});

// 写一行
s.write(data, function () {
  // 回调函数可选
  console.log('wrote');
});

// 结束
s.end(function () {
  // 回调函数可选
  console.log('end');
});
```
