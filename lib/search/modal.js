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
    this.div({class: 'qiitatom-search-modal'}, () => {
      this.div({
        outlet: 'cover',
        class : 'qiitatom-modal__loadingCover'
      }, () => {
        this.div({
          outlet: 'loading',
          id    : 'qiitatom-modal__loadingCover--container'
        }, () => {
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar1'
          });
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar2'
          });
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar3'
          });
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar4'
          });
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar5'
          });
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar6'
          });
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar7'
          });
          this.div({
            class: 'qiitatom-modal__loadingCover-bar',
            id   : 'qiitatom-modal__loadingCover-bar8'
          });
        });
      });
      this.span({
        class: 'qiitatom-search-modal__header--label'
      }, 'Qiita Search');
      this.button({
        outlet  : 'authButton',
        class   : 'qiitatom-search-modal__auth--button',
        disabled: true
      }, '認証する');
      this.div({
        class: 'qiitatom-search-modal__forms'
      }, () => {
        this.div({
          class: 'qiitatom-search-modal__forms--query-input'
        }, () => {
          this.subview('keyword', new TextEditorView({mini: true, placeholderText: 'Search Text'}));
        });
        this.div({class: 'qiitatom-search-modal__forms--buttons'}, () => {
          this.input({
            outlet : 'typeTitle',
            class  : 'qiitatom-search-modal__forms--buttons--type-button',
            id     : 'title',
            type   : 'radio',
            value  : 'title',
            name   : 'searchType',
            checked: 'checked'
          });
          this.label({
            for  : 'title',
            class: 'qiitatom-search-modal__forms--buttons--type-label'
          }, 'タイトル');
          this.input({
            outlet: 'typeTag',
            class : 'qiitatom-search-modal__forms--buttons--type-button',
            id    : 'tag',
            type  : 'radio',
            value : 'tag',
            name  : 'searchType'
          });
          this.label({
            for  : 'tag',
            class: 'qiitatom-search-modal__forms--buttons--type-label'
          }, 'タグ');
          this.input({
            outlet: 'typeKeyword',
            class : 'qiitatom-search-modal__forms--buttons--type-button',
            id    : 'keyword',
            type  : 'radio',
            value : 'keyword',
            name  : 'searchType'
          });
          this.label({
            for  : 'keyword',
            class: 'qiitatom-search-modal__forms--buttons--type-label'
          }, 'キーワード');
          this.button({
            outlet: 'searchButton',
            class : 'qiitatom-search-modal__forms--buttons-search'
          }, '検索');
          this.button({
            outlet: 'cancelButton',
            class : 'qiitatom-search-modal__forms--buttons-cancel'
          }, 'キャンセル');
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
      if (protocol === resultProtocol) return new SearchResult();
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
          this.toggleAuthModl(false);
          this.updateAuthenticationStatuses(true);
          localStorage.setItem(storageKey, token);
        };
        const onCanceled = () => {
          this.toggleAuthModl(false);
        };
        this.authModal = atom.workspace.addModalPanel({
          item: new AuthModal(onCompleted, onCanceled),
          visible: false
        });
      }
      this.toggleAuthModl(true);
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


  toggleAuthModl(enabled) {
    if (this.searchModal) enabled ? this.searchModal.hide() : this.searchModal.show();
    if (this.authModal) enabled ? this.authModal.show() : this.authModal.hide();
  }

  toggleCover(enabled) {
    this.searchButton.context.disabled = enabled;
    this.keyword.context.disabled = enabled;
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
          alert(`${text} の検索結果が見つかりませんでした`);
          return;
        }
        atom.workspace.open(`${resultProtocol}//result`, {split: 'right'})
          .then((view) => {
            view.initializeView(response.data, apiName, text, Math.ceil(Number(response.headers['total-count']) / 20));
            atom.workspace.activatePreviousPane();
          });
        this.close();
      })
      .catch((e) => {
        let message = '不明なエラーが発生しました';
        if (Reflect.has(e.response, 'data')) {
          switch (e.response.data.type) {
            case 'not_found':
              message = `${text} の検索結果が見つかりませんでした`;
              break;
            default:
              break;
          }
        }
        alert(message);
        this.toggleCover(false);
        this.keyword.focus();
      });
  }

  close() {
    this.toggleAuthModl(false);
    this.toggleCover(false);
    this.focusout();
    this.keyword.setText('');
    this.searchModal.hide();
  }
}
