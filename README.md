# linter-hodgepodge
Linter大杂烩，在node程序中，使用各种linter，并生成html报告。

# How to use?

``npm install linter-hodgepodge --save``

```javascript
let linter = require('./../index');

let linterResult = linter.jshint([
  './lib/**/*.js',
  '!./*.md'
], {varstmt: false}, {window: true});

// 获取html字符串
let reporterHtml = linterResult.reporter();

// 生成html文件
linterResult.reporterAsFile('test.html');
```