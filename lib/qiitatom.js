'use babel';

import Modal from './qiitatom-view';
import { CompositeDisposable } from 'atom';
import { React, ReactDOM } from 'react-for-atom';

export default {

  qiitatomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    const modalView = document.createElement('div');
    this.modalPanel = atom.workspace.addModalPanel({
      item: modalView,
      visible: false
    });

    ReactDOM.render(
      <Modal
        onClickSearchButton={this.search.bind(this)}
        onClickCancelButton={() => {this.modalPanel.hide()}}
      />, modalView);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:toggle': () => this.toggle()
    }));
  },

  search() {
    setTimeout(() => {
      this.modalPanel.hide();
      atom.workspace.open('', {split: 'right'});
    }, 2000);
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
