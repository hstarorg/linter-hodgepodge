'use strict';

let fs = require('fs');
let path = require('path');
let jshint = require('jshint');
let LinterResult = require('./../LinterResult');
let JSHintReporter = require('./JSHintReporter');
let tools = require('./../tools');

const defaults = {
  curly: true, // 强制大括号（while(){}）
  eqeqeq: true, // 禁用 == 和 !=
  esversion: 6, // 设定ECMA版本
  forin: true, // 强制for in循环，必须使用hasOwnProperty
  freeze: true, // 禁止覆盖本地对象，如Date，Array等
  funcscope: true, // 禁止变量提前访问
  globals: [], // 全局变量
  iterator: true, // 禁止使用__iterator__
  latedef: true, // 禁止使用后定义的变量
  maxcomplexity: 15, // 设定最大圈复杂度
  maxdepth: 5, // 设定最大深度
  maxerr: 50, // 设定最大JSHINT的警告数
  maxlen: 80, // 设定单行js的最大长度
  maxparams: 6, // 设定最大函数参数个数
  maxstatements: 100, // 设定函数最大语句个数
  noarg: true, // 禁止使用arguments.caller和anguments.callee
  nocomma: true, // 禁用逗号运算符
  nonbsp: true, // 禁止非空格的空白字符
  nonew: true, // 大写开头的函数，实例化必须用new
  notypeof: true, //typeof时，禁用typeof操作的无效值
  predef: [],
  shadow: true,
  singleGroups: true,
  strict: 'global', // 严格模式级别：global, implied, false, true
  undef: true, // 禁止使用未定义的变量
  unused: true, // 禁止未使用的变量
  varstmt: false // 设置为true，则禁用var定义变量
};

let jshintFunc = (pattern, options, predef) => {
  let files = tools.getFiles(pattern);
  let results = [];
  options = tools.extend(defaults, options || {});
  console.log(options);
  predef = tools.extend(predef || {});
  files.forEach((file) => {
    let codeLines = fs.readFileSync(file, 'utf8').split('\r\n');
    jshint.JSHINT(codeLines, options, predef);
    jshint.JSHINT.errors.forEach(errObj => {
      results.push({
        file: file,
        error: errObj
      });
    });
  });
  return new LinterResult({
    reporterInstance: new JSHintReporter(),
    results: results
  });
};

module.exports = {
  jshint: jshintFunc
};