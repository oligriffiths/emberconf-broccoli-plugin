'use strict';

const Plugin = require("broccoli-plugin");
const MarkdownIt = require("markdown-it");
const fs = require("fs");
const path = require('path');
const mkdirp = require('mkdirp');
const walkSync = require('walk-sync');

class MarkdownTemplates extends Plugin {
  constructor(options) {
    super([], options);

    this.rootPath = options.rootPath;
    this.contentFolder = options.contentFolder || 'markdown';
    this.parser = new MarkdownIt();
  }

  build() {
    const files = walkSync(`${this.rootPath}/${this.contentFolder}`, { globs: ['**/*.md'] });
    files.forEach(file => this.processFile(file));
  }

  processFile(file) {
    const path = `${this.rootPath}/${this.contentFolder}/${file}`;
    const content = this.parseFile(path);
    this.writeTemplate(content, file);
  }

  writeTemplate(content, markdownFile) {
    const file = path.parse(markdownFile);
    const dir = `${this.outputPath}/${this.contentFolder}/${file.dir}`;
    const templatePath = `${dir}/${file.name}.hbs`;

    mkdirp.sync(dir);
    fs.writeFileSync(templatePath, content);
  }

  parseFile(filePath) {
    const markdown = fs.readFileSync(filePath);
    const markdownString = markdown.toString('utf8');

    return this.parser.render(markdownString);
  }
}

module.exports = function markdownTemplates(options) {
  return new MarkdownTemplates(options);
}
