'use strict';

const broccoliMarkdownContent = require('./lib/markdown-content');
const broccoliMarkdownTemplates = require('./lib/markdown-templates');

module.exports = {
  name: require('./package').name,

  isDevelopingAddon() {
    return false;
  },

  treeForTemplates(tree) {
    tree = this._super(tree);

    tree = broccoliMarkdownTemplates({
      rootPath: this.app.project.root + '/app',
      contentFolder: 'markdown',
    });

    return tree;
  },

  preprocessTree (type, tree) {
    if (type === 'template') {
      tree = broccoliMarkdownContent(tree);
    }
    return tree;
  }
};
