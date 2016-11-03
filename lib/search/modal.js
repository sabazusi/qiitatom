'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import url from 'url';
import QiitaClient from '../client';
import SearchResult from './result';
import AuthModal from '../authentication';
import {
  LOCAL_STORAGE_KEYNAME as storageKey,
  SEARCH_RESULT_PANE_PROTOCOL as resultProtocol
} from '../constants';

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
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:search': () => {
        this.searchModal = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });

        // check auth key
        this.auth().then((hasAuthenticated) => this.updateAuthenticationStatuses(hasAuthenticated));
        this.searchModal.show();
        this.keyword.focus();
      }
    }));

    // UI events
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
    this.authButton.on('click', () => this.onClickAuthButton());

    atom.workspace.addOpener((uri) => {
      const {
        protocol,
        host,
        pathname
      } = url.parse(uri);

      // url = qiitatomsearch://search-target-keyword
      if (protocol === resultProtocol) return new SearchResult(host);
    });

    this.toggleCover(false);
  }

  onClickAuthButton() {
    if (this.hasAuthenticated) {
      if (confirm('現在の認証情報を削除しますか?')) {
        QiitaClient.clearToken();
        localStorage.removeItem(storageKey);
        this.updateAuthenticationStatuses(false);
      }
    } else {
      if (!this.authModal) {
        const onCompleted = (token) => {
          this.toggleAuthPanel(false);
          this.updateAuthenticationStatuses(true);
          localStorage.setItem(storageKey, token);
        };
        const onCanceled = () => {
          this.toggleAuthPanel(false);
        };
        this.authModal = atom.workspace.addModalPanel({
          item: new AuthModal(onCompleted, onCanceled),
          visible: false
        });
      }
      this.toggleAuthPanel(true);
    }
  }

  auth() {
    const authToken = localStorage.getItem(storageKey, '');
    return QiitaClient.auth(authToken);
  }

  updateAuthenticationStatuses(hasAuthenticated) {
    this.authButton.context.disabled = false;
    this.authButton.context.textContent = hasAuthenticated ? '認証解除' : '認証する';
    this.hasAuthenticated = hasAuthenticated;
  }


  toggleAuthPanel(enabled) {
    if (this.searchModal) enabled ? this.searchModal.hide() : this.searchModal.show();
    if (this.authModal) enabled ? this.authModal.show() : this.authModal.hide();
  }

  toggleCover(enabled) {
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
        atom.workspace.open(`${resultProtocol}//${text}`, {split: 'right'})
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
    this.toggleAuthPanel(false);
    this.toggleCover(false);
    this.focusout();
    this.keyword.setText('');
    this.searchModal.hide();
  }

  getTitle() {
    return '';
  }
}
