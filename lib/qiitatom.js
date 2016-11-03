'use babel';

import Search from './search';
import Post from './post';

export default {
  search       : null,
  post         : null,
  subscriptions: null,

  activate(state) {
    this.search = new Search();
    this.post = new Post();
  },

  deactivate() {
    this.search.destroy();
    this.post.destroy();
  },

  serialize() {
    return {};
  }
};
