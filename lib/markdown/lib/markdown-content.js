'use strict';

const Filter = require("broccoli-filter");
const MarkdownIt = require("markdown-it");
const mdHighlight = require('markdown-it-highlightjs');
const mdAnchor = require('markdown-it-anchor');
const mdToc = require ('markdown-it-toc-done-right');
const fs = require("fs");
const path = require('path');

class BroccoliMarkdownContent extends Filter {
  constructor(inputNodes, options) {
    options = options || {};
    options.extensions = ["hbs", "md"];
    super(inputNodes, options);

    this.rootPath = options.rootPath || 'app';
    this.parser = new MarkdownIt();
    this.parser
      .use(mdHighlight)
      .use(mdAnchor, {
        permalink: true,
        permalinkSymbol: '⚭',
      })
      .use(mdToc);
  }

  processString(contents, filePath) {
    const isMd = filePath.match(/\.md$/);

    let template = contents.toString('utf8');

    if (isMd) {
      template = this.replaceMakrdownFile(template);
    } else {
      template = this.replaceTemplateFile(template);
      template = this.replaceTemplateContent(template);
    }

    return Buffer.from(template);
  }

  getDestFilePath(filePath) {
    if (filePath.match(/\.md$/)) {
      filePath = filePath.replace(/\.md$/, '.hbs');
    }

    return filePath;
  }

  replaceMakrdownFile(content) {
    return this.parser.render(content);
  }

  replaceTemplateFile(template) {
    return template.replace(/\{\{markdown-file.*file=['"]([^'"]+)['"].*\}\}/, (string, file) => {

      if (!file) {
        throw new Error('{{markdown-file}} must be invoked with {{markdown-file file="path/to/file"}}');
      }

      const filePath = path.join(this.rootPath, file);
      if (!fs.existsSync(filePath)) {
        throw new Error(`The file ${filePath} does not exit`);
      }

      const markdown = fs.readFileSync(filePath);
      const markdownString = markdown.toString('utf8');

      return this.parser.render(markdownString);
    });
  }

  replaceTemplateContent(template) {
    return template.replace(/\{\{#markdown-content\}\}([^]*)\{\{\/markdown-content\}\}/m, (string, content) => {
      return this.parser.render(content)
    });
  }
}

module.exports = function broccoliMarkdownContent(inputNode, options) {
  return new BroccoliMarkdownContent(inputNode, options);
}
