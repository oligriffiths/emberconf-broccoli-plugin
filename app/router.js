import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('index', { path: '/' });
  this.route('blog.index', { path: '/blog' });
  this.route('blog.path', { path: '/blog/*path' });
});

export default Router;
