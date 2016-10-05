'use babel';

import SearchModal from './search';
import PostModal from './post';

export default {
  searchModal: null,
  postModal: null,
  subscriptions: null,

  activate(state) {
    this.searchModal = new SearchModal();
    this.postModal = new PostModal();
  },

  deactivate() {
    this.searchModal.destroy();
    this.postModal.destroy();
  },

  serialize() {
    return {};
  }
};
