'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import QiitaClient from './client';
import url from 'url';
import ResultView from './result-view';

export default class extends View {
  static content() {
    this.div({class: 'qiitatom'}, () => {
      this.span('Qiita Search');
      this.div({class: 'forms'}, () => {
        this.div({class: 'qiita-input'}, () => {
          this.subview('keyword', new TextEditorView({mini: true, placeholderText: 'Search Text'}));
        });
        this.div({class: 'qiita-input'}, () => {
          this.label({for: 'title'}, 'タイトル');
          this.input({outlet: 'typeTitle', id: 'title', type: 'radio', value: 'title', name: 'searchType', checked: 'checked'});
          this.label({for: 'tat'}, 'タグ');
          this.input({outlet: 'typeTag', id: 'tag', type: 'radio', value: 'tag', name: 'searchType'});
          this.label({for: 'keyword'}, 'キーワード');
          this.input({outlet: 'typeKeyword', id: 'keyword', type: 'radio', value: 'keyword', name: 'searchType'});
          this.button({outlet: 'searchButton', class: 'searchButton'}, '検索');
          this.button({outlet: 'cancelButton', class: 'cancelButton'}, 'キャンセル');
        });
      });
    });
  }

  initialize() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:toggle': () => {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
        this.panel.show();
        this.keyword.focus();
      }
    }));
    this.subscriptions.add(atom.commands.add(this.element, {
      'core:confirm': () => {
        this.post();
      },
      'core:cancel': () => {
        this.close()
      }
    }));
    this.searchButton.on('click', () => {
      this.post();
    });
    this.cancelButton.on('click', () => {
      this.close();
    });

    atom.workspace.addOpener((uri) => {
      const {
        protocol,
        host,
        pathname
      } = url.parse(uri);

      if (protocol === 'qiitatom:') return new ResultView(host);
    });
  }

  post() {
    const text = this.keyword.getText();
    let api;
    if (this.typeTitle.is(':checked')) api = QiitaClient.searchByTitle;
    if (this.typeTag.is(':checked')) api = QiitaClient.searchByTag;
    if (this.typeKeyword.is(':checked')) api = QiitaClient.searchByKeyword;
    if (!api || !text) return;
    api(text, 1)
      .then((response) => {
        atom.workspace.open(`qiitatom://${text}`, {split: 'right'})
          .then((view) => {
            view.initializeView(response.data, api, Math.ceil(Number(response.headers['total-count']) / 20));
            atom.workspace.activatePreviousPane();
          });
        this.close();
      });
  }

  close() {
    this.panel.hide();
    this.focusout();
    this.keyword.setText('');
  }

  getTitle() {
    return '';
  }
}
