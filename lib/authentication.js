'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';

export default class extends View {
  static content() {
    this.div({class: 'qiitatom__authpanel__container'}, () => {
      this.div({class: 'qiitatom__authpanel__buttons'}, () => {
        this.button({outlet: 'getCodeButton', class: 'qiitatom__authpanel__getcodebutton'}, 'アクセストークンを取得');
        this.button({outlet: 'authButton', class: 'qiitatom__authpanel__authbutton'}, '認証');
      });
      this.div({class: 'qiitatom__authpanel__input'}, () => {
        this.subview('codeInput', new TextEditorView({mini: true, placeholderText: 'Input your accesst token'}))
      });
    });
  }
  initialize() {}
  getTitle() { return '';}
}
