# node-lei-stream
Read/Write Stream

**正在紧张写代码中……**

## 安装

```bash
npm install lei-stream --save
```

## readLine

按行读取流

```javascript
var fs = require('fs');
var readLineStream = require('lei-stream').readLine;

// readLineStream第一个参数为ReadStream实例，也可以为文件名
var s = readLineStream(fs.createReadStream('./myfile.txt'), {
  // 换行符，默认\n
  newline: '\n',
  // 是否自动读取下一行，默认false
  autoNext: false,
  // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
  encoding: function (data) {
    return JSON.parse(data);
  }
});
s.on('data', function (data) {
  console.log(data);
  s.next();
});
s.on('end', function () {
  console.log('end');
});
```

## writeLine

按行写流

```javascript
var fs = require('fs');
var writeLineStream = require('lei-stream').writeLine;

var s = writeLineStream(fs.createWriteStream('./myfile.txt'), {
  // 换行符，默认\n
  newline: '\n',
  // 自动写入时间间隔，使用write()写入时不会立刻写到流
  interval: 1000,
  // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
  encoding: function (data) {
    return JSON.stringify(data);
  }
});

// 写一行（不立刻写入流）
s.write(data);

// 立刻写入流
s.flush(callback);
```
