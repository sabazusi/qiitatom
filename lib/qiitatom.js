'use babel';

import Modal from './components/modal';
import ResultView from './result-view';
import { CompositeDisposable } from 'atom';
import { React, ReactDOM } from 'react-for-atom';
import url from 'url';

export default {

  RESULT_VIEW_URI: 'qiitatom://result-view',

  qiitatomView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    atom.workspace.addOpener((uri) => {
      if (url.parse(uri).protocol === 'qiitatom:') {
        return new ResultView();
      }
    });
    const modalView = document.createElement('div');
    this.modalPanel = atom.workspace.addModalPanel({
      item: modalView,
      visible: false
    });

    ReactDOM.render(
      <Modal
        onFetchSearchResult={this.fetchedFirstResult.bind(this)}
        onClickCancelButton={() => {this.modalPanel.hide()}}
      />, modalView);

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:toggle': () => this.toggle()
    }));
  },

  fetchedFirstResult(result, query) {
    setTimeout(() => {
      this.modalPanel.hide();
      atom.workspace.open(this.RESULT_VIEW_URI, {split: 'right'});
    }, 2000);
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.qiitatomView.destroy();
  },

  serialize() {
    return {};
  },

  toggle() {
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
