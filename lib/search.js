'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import url from 'url';
import QiitaClient from './client';
import SearchView from './search-view';
import AuthPanel from './authentication';

export default class extends View {
  static content() {
    this.div({class: 'qiitatom'}, () => {
      this.div({outlet: 'loading', id: 'qiitatom__search-cover-loading'}, () => {
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar1'});
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar2'});
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar3'});
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar4'});
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar5'});
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar6'});
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar7'});
        this.div({class: 'qiitatom__search-cover-loading-bar', id: 'qiitatom__search-cover-loading-bar8'});
      });
      this.div({outlet: 'cover', class: 'qiitatom__search-cover'}, () => {
      });
      this.span({class: 'headerLabel'}, 'Qiita Search');
      this.button({outlet: 'authButton', class: 'qiitatomAuthButton', disabled: true}, '認証する');
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
    const authToken = localStorage.getItem('qiitatom.token', '');
    QiitaClient.auth(authToken).then((authenticated) => {
      this.authButton.context.disabled = false;
      this.authButton.context.textContent = authenticated ? '認証解除' : '認証する';
      this.authenticated = authenticated;
    });
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
        this.search();
      },
      'core:cancel': () => {
        this.close()
      }
    }));

    this.searchButton.on('click', () => {
      this.search();
    });
    this.cancelButton.on('click', () => {
      this.close();
    });
    this.authButton.on('click', () => {
      if (this.authenticated) {
        if (confirm('現在の認証情報を削除しますか?')) {
          QiitaClient.clearToken();
          localStorage.removeItem('qiitatom.token');
          this.authenticated = false;
          this.authButton.context.textContent = '認証する';
        }
      } else {
        const panel = atom.workspace.addModalPanel({
          item: new AuthPanel(
            (token) => { // auth completed handler
              panel.hide();
              this.panel.show();
              this.authenticated = true;
              this.authButton.context.textContent = '認証解除';
              localStorage.setItem('qiitatom.token', token);
            },
            () => { // auth canceled handler
              panel.hide();
              this.panel.show();
            }),
          visible: true
        });
      }
    });

    atom.workspace.addOpener((uri) => {
      const {
        protocol,
        host,
        pathname
      } = url.parse(uri);

      if (protocol === 'qiitatomsearch:') return new SearchView(host);
    });

    this.toggleCover(false);
  }

  toggleCover(enabled=false) {
    this.searchButton.context.disabled = enabled;
    this.keyword.context.disabled = enabled;
    this.loading.context.style.visibility = enabled ? '' : 'hidden';
    this.cover.context.style.visibility = enabled ? '' : 'hidden';
  }

  search() {
    this.toggleCover(true);
    const text = this.keyword.getText();
    if (text.length === 0) return;
    let apiName;
    if (this.typeTitle.is(':checked')) apiName = 'searchByTitle';
    if (this.typeTag.is(':checked')) apiName = 'searchByTag';
    if (this.typeKeyword.is(':checked')) apiName = 'searchByKeyword';
    if (!apiName) return;

    this.searchButton.context.disabled = true;
    QiitaClient[apiName](text, 1)
      .then((response) => {
        if (response.data.length <= 0) {
          this.toggleCover(false);
          alert('No search result');
          return;
        }
        atom.workspace.open(`qiitatomsearch://${text}`, {split: 'right'})
          .then((view) => {
            view.initializeView(response.data, apiName, Math.ceil(Number(response.headers['total-count']) / 20));
            atom.workspace.activatePreviousPane();
          });
        this.close();
      })
      .catch(() => {
        alert('Error');
        this.toggleCover(false);
        this.keyword.focus();
      });
  }

  close() {
    this.toggleCover(false);
    this.panel.hide();
    this.focusout();
    this.keyword.setText('');
  }

  getTitle() {
    return '';
  }
}
