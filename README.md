# lei-stream
Read/Write Stream

## 安装

```bash
$ npm install lei-stream --save
```

**需要 Node.js v4.0.0 或更改版本**


## readLine 按行读取流

使用方法1：

```javascript
'use strict';

const readLine = require('lei-stream').readLine;

readLine('./myfile.txt').go((data, next) => {
  console.log(data);
  next();
}, function () {
  console.log('end');
});
```

使用方法2：

```javascript
'use strict';

const fs = require('fs');
const readLine = require('lei-stream').readLine;

// readLineStream第一个参数为ReadStream实例，也可以为文件名
const s = readLine(fs.createReadStream('./myfile.txt'), {
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
s.on('data', (data) => {
  console.log(data);
  s.next();
});

// 流结束时触发end事件
s.on('end', () => {
  console.log('end');
});

// 读取时出错
s.on('error', (err) => {
  console.error(err);
});
```

## writeLine

按行写流

```javascript
'use strict';

const fs = require('fs');
const writeLineStream = require('lei-stream').writeLine;

// writeLineStream第一个参数为WriteStream实例，也可以为文件名
const s = writeLineStream(fs.createWriteStream('./myfile.txt'), {
  // 换行符，默认\n
  newline: '\n',
  // 编码器，可以为函数或字符串（内置编码器：json，base64），默认null
  encoding: function (data) {
    return JSON.stringify(data);
  },
  // 缓存的行数，默认为0（表示不缓存），此选项主要用于优化写文件性能，写入的内容会先存储到缓存中，当内容超过指定数量时再一次性写入到流中，可以提高写速度
  cacheLines: 0
});

// 写一行
s.write(data, () => {
  // 回调函数可选
  console.log('wrote');
});

// 结束
s.end(() => {
  // 回调函数可选
  console.log('end');
});

// 写时出错
s.on('error', (err) => {
  console.error(err);
});
```


## TailStream

监听文件新增内容变化的流（返回的是一个`Readable Stream`,具体可参考 Node.js API 文档）

```javascript
'use strict';

const tailStream = require('lei-stream').tailStream;

// 创建流
const s = tailStream('./myfile.txt', {
  position: 'end', // end表示监听之前先定位到文件末尾,否则会先读取出文件之前的所有内容再开始监听
});

// 有新内容会触发data事件
s.on('data', data => {
  console.log(data);
});
````



## License

```
The MIT License (MIT)

Copyright (c) 2015-2016 Zongmin Lei <leizongmin@gmail.com>
http://ucdok.com

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
