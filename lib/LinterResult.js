'use strict';

let fs = require('fs');

class LinterResult {
  constructor(options) {
    this.reporterInstance = options.reporterInstance;
    this.results = options.results;
  }

  reporter() {
    return this.reporterInstance.reporter(this.results);
  }

  reporterAsFile(filePath) {
    let htmlContent = this.reporter();
    fs.writeFileSync(filePath, htmlContent, 'utf8');
  }
}

module.exports = LinterResult;