'use strict';

let glob = require('glob');
let _ = require('lodash');

let _isNegative = (pattern) => {
  if (typeof pattern === 'string') {
    return pattern[0] === '!';
  }
  if (pattern instanceof RegExp) {
    return true;
  }
};

let getFiles = (pattern) => {
  if (!pattern) {
    throw new Error('glob pattern required.');
  }
  if (!Array.isArray(pattern)) {
    pattern = [pattern];
  }
  let files = new Set();
  pattern.forEach((item, index) => {
    if (typeof item !== 'string' && !(item instanceof RegExp)) {
      throw new Error('Invalid glob at index ' + index);
    }
    let isNegative = _isNegative(item);
    item = item.replace(/^!/, '');
    let tmpFiles = glob.sync(item);
    if (isNegative) {
      tmpFiles.forEach(x => files.delete(x));
    } else {
      tmpFiles.forEach(x => files.add(x));
    }
  });
  return files;
};

let extend = (defaults, options) => {
  return _.assign({}, defaults, options);
};

module.exports = {
  getFiles: getFiles,
  extend: extend
};