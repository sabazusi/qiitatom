'use babel';

import ModalPanelView from './modal';

export default {
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.modalPanel = new ModalPanelView();
  },

  deactivate() {
    this.modalPanel.destroy();
  },

  serialize() {
    return {};
  }
};
