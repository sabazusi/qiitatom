'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import QiitaClient from './client';
import url from 'url';
import SearchView from './search-view';

export default class extends View {
  static content() {
    this.div({class: 'qiitatom'}, () => {
      this.span({class: 'headerLabel'}, 'Qiita Search');
      this.button({outlet: 'authButton', class: 'qiitatomAuthButton'}, '認証解除');
      this.div({class: 'qiitatomForms'}, () => {
        this.div({class: 'qiitatomTextInput'}, () => {
          this.subview('keyword', new TextEditorView({mini: true, placeholderText: 'Search Text'}));
        });
        this.div({class: 'qiitatomButtons'}, () => {
          this.input({outlet: 'typeTitle', class: 'qiitaSearchRadioButton', id: 'title', type: 'radio', value: 'title', name: 'searchType', checked: 'checked'});
          this.label({for: 'title', class: 'qiitaSearchRadioButtonLabel'}, 'タイトル');
          this.input({outlet: 'typeTag', class: 'qiitaSearchRadioButton', id: 'tag', type: 'radio', value: 'tag', name: 'searchType'});
          this.label({for: 'tag', class: 'qiitaSearchRadioButtonLabel'}, 'タグ');
          this.input({outlet: 'typeKeyword', class: 'qiitaSearchRadioButton', id: 'keyword', type: 'radio', value: 'keyword', name: 'searchType'});
          this.label({for: 'keyword', class: 'qiitaSearchRadioButtonLabel'}, 'キーワード');
          this.button({outlet: 'searchButton', class: 'qiitatomSearchButton'}, '検索');
          this.button({outlet: 'cancelButton', class: 'qiitatomCancelButton'}, 'キャンセル');
        });
      });
    });
  }

  initialize() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:search': () => {
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

      if (protocol === 'qiitatomsearch:') return new SearchView(host);
    });
  }

  post() {
    const text = this.keyword.getText();
    if (text.length === 0) return;
    let api;
    if (this.typeTitle.is(':checked')) api = QiitaClient.searchByTitle;
    if (this.typeTag.is(':checked')) api = QiitaClient.searchByTag;
    if (this.typeKeyword.is(':checked')) api = QiitaClient.searchByKeyword;
    if (!api) return;

    this.searchButton.context.disabled = true;
    api(text, 1)
      .then((response) => {
        if (response.data.length <= 0) {
          this.searchButton.context.disabled = false;
          alert('No search result');
          return;
        }
        atom.workspace.open(`qiitatomsearch://${text}`, {split: 'right'})
          .then((view) => {
            view.initializeView(response.data, api, Math.ceil(Number(response.headers['total-count']) / 20));
            atom.workspace.activatePreviousPane();
          });
        this.close();
      })
      .catch(() => {
        alert('Error');
        this.searchButton.context.disabled = false;
      });
  }

  close() {
    this.searchButton.context.disabled = false;
    this.panel.hide();
    this.focusout();
    this.keyword.setText('');
  }

  getTitle() {
    return '';
  }
}
