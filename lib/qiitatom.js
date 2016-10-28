'use babel';

import QiitatomSearch from './search';
import QiitatomPost from './post';

export default {
  searchModal: null,
  postModal: null,
  subscriptions: null,

  activate(state) {
    this.search = new QiitatomSearch();
    this.post = new QiitatomPost();
  },

  deactivate() {
    this.search.destroy();
    this.post.destroy();
  },

  serialize() {
    return {};
  }
};
