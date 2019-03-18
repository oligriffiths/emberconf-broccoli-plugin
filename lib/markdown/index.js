'use strict';

const broccoliMarkdownContent = require('./lib/markdown-content');
const broccoliMarkdownTemplates = require('./lib/markdown-templates');
const log = require('broccoli-stew').log;

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return false;
  },

  treeForTemplates() {
    return log(broccoliMarkdownTemplates(this.app.project.root + '/app/markdown'));
  },

  preprocessTree (type, tree) {
    if (type === 'template') {
      tree = broccoliMarkdownContent(tree);
    }
    return tree;
  }
};
