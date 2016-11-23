'use babel';

import shell from 'shell';
import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import QiitaClient from '../client';
import {GENERATING_TOKEN_URL} from '../constants';

export default class extends View {
  static content() {
    this.div({class: 'qiitatom-auth-modal'}, () => {
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
      this.span({class: 'qiitatom-auth-modal__info'}, 'Qiitaマイページでアクセストークンを発行し入力してください。');
      this.div({class: 'qiitatom-auth-modal__input'}, () => {
        this.subview('codeInput', new TextEditorView({mini: true, placeholderText: '検索には"read_qiita", 投稿には"write_qiita" の権限が必要です'}))
      });
      this.div({class: 'qiitatom-auth-modal__buttons'}, () => {
        this.button({
          outlet: 'getTokenButton',
          class : 'qiitatom__authpanel__getcodebutton'
        }, 'アクセストークンを取得');
        this.button({
          outlet: 'authButton',
          class : 'qiitatom__authpanel__authbutton'
        }, '認証');
      });
    });
  }

  constructor(onAuthenticated, onClose) {
    super();
    this.onAuthenticated = onAuthenticated;
    this.onClose = onClose;
  }

  initialize() {
    this.toggleCover(false);
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add(this.element, {
      'core:confirm': () => {
        this.tryAuth();
      },
      'core:cancel': () => {
        if (this.onClose) {
          this.toggleCover(false);
          this.onClose();
        }
      }
    }));

    this.authButton.on('click', () => {
      this.tryAuth();
    });
    this.getTokenButton.on('click', () => {
      shell.openExternal(GENERATING_TOKEN_URL);
    });
  }

  tryAuth() {
    const token = this.codeInput.getText();
    if (!token || token.trim() === '') return;
    this.toggleInputs(false);
    this.toggleCover(true);
    QiitaClient.auth(token)
      .then((authResult) => {
        if (authResult) {
          if (this.onAuthenticated) this.onAuthenticated(token);
          this.toggleCover(false);
          this.toggleInputs(true);
        } else {
          alert('入力されたトークンの認証に失敗しました');
          this.toggleCover(false);
          this.toggleInputs(true);
        }
      });
  }

  toggleInputs(enabled) {
    this.authButton.context.disabled = this.getTokenButton.context.disabled = !enabled;
  }

  toggleCover(enabled) {
    this.cover.context.style.visibility = enabled ? '' : 'hidden';
  }
}
