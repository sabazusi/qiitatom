'use babel';

import ModalPanelView from './modal';
import PostModalPanelView from './post-modal';

export default {
  searchModalPanel: null,
  postModalPanel: null,
  subscriptions: null,

  activate(state) {
    this.searchModalPanel = new ModalPanelView();
    this.postModalPanel = new PostModalPanelView();
  },

  deactivate() {
    this.searchModalPanel.destroy();
    this.postModalPanel.destroy();
  },

  serialize() {
    return {};
  }
};
