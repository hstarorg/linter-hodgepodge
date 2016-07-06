'use strict';

let linter = require('./../index');

let a =linter.jshint([
  './lib/**/*.js',
  '!./*.md'
], {});
console.log(a.reporterAsFile('./test/test.html'));