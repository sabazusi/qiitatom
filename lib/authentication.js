'use babel';

import shell from 'shell';
import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import QiitaClient from './client';

export default class extends View {
  static content() {
    this.div({class: 'qiitatom__authpanel__container'}, () => {
      this.span({class: 'qiitatom__authpanel__infolabel'}, 'Qiitaマイページでアクセストークンを発行し入力してください。');
      this.span({class: 'qiitatom__authpanel__infolabel'}, '検索:read_qiita 投稿:write_qiita が必要です。');
      this.div({class: 'qiitatom__authpanel__input'}, () => {
        this.subview('codeInput', new TextEditorView({mini: true, placeholderText: 'Input your accesst token'}))
      });
      this.div({class: 'qiitatom__authpanel__buttons'}, () => {
        this.button({outlet: 'getTokenButton', class: 'qiitatom__authpanel__getcodebutton'}, 'アクセストークンを取得');
        this.button({outlet: 'authButton', class: 'qiitatom__authpanel__authbutton'}, '認証');
      });
    });
  }

  constructor(onAuthenticated, onClose) {
    super();
    this.onAuthenticated = onAuthenticated;
    this.onClose = onClose;
  }

  initialize() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add(this.element, {
      'core:confirm': () => {
        this.tryAuth();
      },
      'core:cancel': () => {
        if (this.onClose) this.onClose();
      }
    }));

    this.authButton.on('click', () => {
      this.tryAuth();
    });
    this.getTokenButton.on('click', () => {
      shell.openExternal('https://qiita.com/settings/tokens/new');
    });
  }

  tryAuth() {
    const token = this.codeInput.getText();
    if (!token || token.trim() === '') return;
    this.toggleInputs(false);
    QiitaClient.auth(token)
      .then((authResult) => {
        if (authResult) {
          if (this.onAuthenticated) this.onAuthenticated(token);
          this.toggleInputs(true);
        } else {
          alert('Authentication Failed');
          this.toggleInputs(true);
        }
      });
  }

  toggleInputs(enabled) {
    this.authButton.context.disabled = this.getTokenButton.context.disabled = !enabled;
  }

  getTitle() { return '';}
}
