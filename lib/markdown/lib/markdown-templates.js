'use strict';

const Plugin = require("broccoli-plugin");
const MarkdownIt = require("markdown-it");
const mdHighlight = require('markdown-it-highlightjs');
const mdAnchor = require('markdown-it-anchor');
const mdToc = require ('markdown-it-toc-done-right');
const fs = require("fs");
const path = require('path');
const mkdirp = require('mkdirp');
const walkSync = require('walk-sync');

class MarkdownTemplates extends Plugin {
  constructor(inputNode, options) {
    super([inputNode], options);

    this.parser = new MarkdownIt();
    this.parser
      .use(mdHighlight)
      .use(mdAnchor, {
        permalink: true,
        permalinkSymbol: '⚭',
      })
      .use(mdToc);
  }

  build() {
    const files = walkSync(this.inputPaths[0], { globs: ['**/*.md'] });
    files.forEach(file => this.processFile(file));
  }

  processFile(file) {
    const path = `${this.inputPaths[0]}/${file}`;
    const content = this.parseFile(path);
    this.writeTemplate(content, file);
  }

  parseFile(filePath) {
    const markdown = fs.readFileSync(filePath);
    const markdownString = markdown.toString('utf8');

    return this.parser.render(markdownString);
  }

  writeTemplate(content, markdownFile) {
    const file = path.parse(markdownFile);
    const dir = `${this.outputPath}/markdown/${file.dir}`;
    const templatePath = `${dir}/${file.name}.hbs`;

    mkdirp.sync(dir);
    fs.writeFileSync(templatePath, content);
  }

}

module.exports = function markdownTemplates(options) {
  return new MarkdownTemplates(options);
}

module.exports.MarkdownTemplates = MarkdownTemplates;
