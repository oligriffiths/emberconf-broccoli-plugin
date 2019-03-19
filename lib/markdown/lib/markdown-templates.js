'use strict';

const Filter = require("broccoli-filter");
const MarkdownIt = require("markdown-it");
const mdHighlight = require('markdown-it-highlightjs');
const mdAnchor = require('markdown-it-anchor');
const mdToc = require ('markdown-it-toc-done-right');
const path = require('path');

class MarkdownTemplates extends Filter {
  constructor(inputNode, options) {
    options = options || {};
    options.extensions = ['md'];
    super(inputNode, options);

    this.parser = new MarkdownIt();
    this.parser
      .use(mdHighlight)
      .use(mdAnchor, {
        permalink: true,
        permalinkSymbol: '⚭',
      })
      .use(mdToc);
  }

  processString(contents) {
    // Render the markdown from the contents string
    return this.parser.render(contents.toString('utf8'));
  }

  getDestFilePath(markdownFile) {
    // Rewrite the markdown file path into a template path
    const file = path.parse(markdownFile);
    const dir = `ember-markdown/${file.dir}`;
    return `${dir}/${file.name}.hbs`;
  }
}

module.exports = function markdownTemplates(options) {
  return new MarkdownTemplates(options);
}

module.exports.MarkdownTemplates = MarkdownTemplates;
