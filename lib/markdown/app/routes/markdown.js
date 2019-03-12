import Route from '@ember/routing/route';
import { getOwner } from '@ember/application';

export default Route.extend({
  markdownFolder: 'markdown',
  markdownRoot: null,
  markdownIndex: 'index',

  model(params) {
    const path = params.path;
    let file = '';

    // No path is the root
    if (!path) {
      file = this.markdownIndex;

    // If path ends in .html, remove it so we resolve to the correct .md file
    } else if (path.match(/\.html$/) && path !== '.html') {
      file  = path.replace(/\.html/, '');

    // No .html is a directory, default to index
    } else {
      file  = `${path}/${this.markdownIndex}`;
    }

    // Are we rooting to a specific subfolder?
    if (this.markdownRoot) {
      file = `${this.markdownRoot}/${file}`;
    }

    // Construct template name
    let templateName = `${this.markdownFolder}/${file}`;

    // Ensure template exists
    if (!getOwner(this).lookup(`template:${templateName}`)) {
      templateName = 'error';
    }

    this.templateName = templateName;
  }
});