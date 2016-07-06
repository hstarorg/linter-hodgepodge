'use strict';

let fs = require('fs');
let path = require('path');

class JSHintReporter {

  constructor() {
    this._init();
  }

  _init() {
    this.result = null;
    this.templates = {
      body: '',
      item: '',
      itemHeader: '',
      noItems: '',
      summary: ''
    };

    this.numberOfFailures = {
      failures: 0,
      errors: 0,
      warnings: 0
    };
  }

  _isError(errorCode) {
    return errorCode && errorCode[0] === 'E';
  }

  _calculateNumberOfFailures() {
    let self = this;
    self.numberOfFailures.failures = this.result.length;
    this.result.forEach(function (element) {
      if (self._isError(element.error.code)) {
        self.numberOfFailures.errors += 1;
      } else {
        self.numberOfFailures.warnings += 1;
      }
    });
  }

  _loadTemplates() {
    let templatePath = path.join(__dirname) + '/templates/';
    for (let template in this.templates) {
      this.templates[template] = fs.readFileSync(templatePath + template + '.html').toString();
    }
  }

  _escapeHtml(string) {
    if (!string) {
      return string;
    }
    return ('' + string)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/@/g, '&#64;')
      .replace(/\$/g, '&#36;')
      .replace(/\(/g, '&#40;')
      .replace(/\)/g, '&#41;')
      .replace(/\{/g, '&#123;')
      .replace(/\}/g, '&#125;')
      .replace(/\[/g, '&#91;')
      .replace(/\]/g, '&#93;')
      .replace(/\+/g, '&#43;')
      .replace(/=/g, '&#61;')
      .replace(/`/g, '&#96;')
      .replace(/\,/g, '&#44;')
      .replace(/\!/g, '&#33;')
      .replace(/%/g, '&#37;');
  }

  _prepareContent() {
    let self = this;
    let content = '';
    let previousFile = '';

    if (this.result.length === 0) {
      return this.templates.noItems;
    }

    this.result.forEach(function (element) {
      var file = element.file;
      var error = element.error;

      if (previousFile !== file) {
        previousFile = file;
        content += self.templates.itemHeader.replace('{file}', self._escapeHtml(file));
      }

      content += self.templates.item
        .replace('{class}', self._isError(error.code) ? 'danger' : 'warning')
        .replace('{code}', self._escapeHtml(error.code))
        .replace('{line}', self._escapeHtml(error.line))
        .replace('{character}', self._escapeHtml(error.character))
        .replace('{evidence}', self._escapeHtml(error.evidence))
        .replace('{reason}', self._escapeHtml(error.reason));
    });
    return content;
  }

  _prepareSummary() {
    if (!this.numberOfFailures.failures) {
      return '';
    }

    return this.templates.summary
      .replace('{failures}', this._escapeHtml(this.numberOfFailures.failures))
      .replace('{errors}', this._escapeHtml(this.numberOfFailures.errors))
      .replace('{warnings}', this._escapeHtml(this.numberOfFailures.warnings));
  }

  _getRenderedHTML() {
    return this.templates.body
      .replace('{content}', this._prepareContent())
      .replace('{summary}', this._prepareSummary());
  }

  reporter(result) {
    this.result = result;
    this._loadTemplates();
    this._calculateNumberOfFailures();
    return this._getRenderedHTML();
  }

  reorterAsFile(result, filePath) {
    let content = this.reporter(result);
    fs.writeFileSync(filePath, content, 'utf8');
    return filePath;
  }
}

module.exports = JSHintReporter;