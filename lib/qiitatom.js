'use babel';

import QiitatomView from './qiitatom-view';
import { CompositeDisposable } from 'atom';

export default {

  qiitatomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.qiitatomView = new QiitatomView(state.qiitatomViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.qiitatomView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.qiitatomView.destroy();
  },

  serialize() {
    return {
      qiitatomViewState: this.qiitatomView.serialize()
    };
  },

  toggle() {
    console.log('Qiitatom was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
