'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import url from 'url';
import AuthModal from '../authentication';
import Preview from './preview';
import QiitaClient from '../client';
import {
  LOCAL_STORAGE_KEYNAME as storageKey,
  POST_PREVIEW_PANE_PROTOCOL as previewProtocol
} from '../constants';

export default class extends View {
  static content() {
    this.div({class: 'qiitatom-post'}, () => {
      this.div({class: 'qiitatom-post__inputs'}, () => {
        this.div({class: 'qiitatom-post__labels'}, () => {
          this.label('投稿対象ファイル:');
          this.label({outlet: 'targetFileName'}, '');
        });
        this.div({class: 'qiitatom-post__inputs_title'}, () => {
          this.label({class: 'qiitatom-post__inputs_title-label'}, 'タイトル');
          this.subview('postTitleInput', new TextEditorView({mini: true, placeholderText: '投稿タイトル'}));
        });
        this.div({class: 'qiitatom-post__inputs_tags'}, () => {
          this.div({class: 'qiitatom-post-modal__taginput__label'}, () => {
            this.label({class: 'qiitatom-post__inputs_tags-label'}, 'タグ(最大5つ)');
          });
          this.div({class: 'qiitatom-post-modal__taginput__inputs'}, () => {
            this.subview('postTagInput1', new TextEditorView({mini: true}));
            this.subview('postTagInput2', new TextEditorView({mini: true}));
            this.subview('postTagInput3', new TextEditorView({mini: true}));
            this.subview('postTagInput4', new TextEditorView({mini: true}));
            this.subview('postTagInput5', new TextEditorView({mini: true}));
          });
        });
        this.div({class: 'qiitatom-post__publicity'}, () => {
          this.input({outlet: 'public', class: 'qiitatom-post__publicity-button', id: 'public', type: 'radio', value: 'title', name: 'visibilityType'});
          this.label({for: 'public', class: 'qiitatom-post__publicity-label'}, '公開');
          this.input({outlet: 'private', class: 'qiitatom-post__publicity-button', id: 'private', type: 'radio', value: 'tag', name: 'visibilityType', checked: 'checked'});
          this.label({for: 'private', class: 'qiitatom-post__publicity-label'}, '非公開');
        });
        this.div({class: 'qiitatom-post-modal__buttons'}, () => {
          this.label({outlet: 'authButtonLabel', class: 'qiitatom-post-modal__buttons--authButtonLabel'}, '投稿にはqiitaアカウントの認証が必要です');
          this.button({outlet: 'authButton', class: 'qiitatom-post__modal_buttons--authButton'}, '認証する');
          this.button({outlet: 'previewButton', class: 'qiitatom-post-modal__buttons--previewButton'}, 'プレビューを表示する');
        });
      });
    });
  }

  initialize() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:post': () => {
        this.targetFileName.context.innerText = atom.workspace.getActivePaneItem().getTitle();
        this.postModal = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
        // check auth key
        this.auth().then((hasAuthenticated) => this.updateAuthenticationStatuses(hasAuthenticated));
        this.postModal.show();
        this.postTitleInput.focus();
      }
    }));

    this.previewButton.on('click', () => this.preview());
    this.authButton.on('click', () => this.onClickAuthButton());
    this.subscriptions.add(atom.commands.add(this.element, {
      'core:confirm': () => {
        this.preview();
      },
      'core:cancel': () => {
        this.close()
      }
    }));

    atom.workspace.addOpener((uri) => {
      const {
        protocol,
        host,
        pathname
      } = url.parse(uri);

      if (protocol === previewProtocol) return new Preview();
    });
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

  preview() {
    const tags = [this.postTagInput1, this.postTagInput2, this.postTagInput3, this.postTagInput4, this.postTagInput5]
      .map((input) => input.getText().replace('　', '').trim())
      .filter((tag) => tag !== '');
    if (tags.length === 0) {
      alert('タグは1つ以上指定してください');
      return;
    }
    const targetEditor = atom.workspace.getActiveTextEditor();
    if (!targetEditor || targetEditor.getText() === '') {
      alert('この内容は投稿できません');
      return;
    }
    atom.workspace.open(`${previewProtocol}//preview`, {split: 'right'})
      .then((view) => {
        view.render(
          targetEditor.getText(),
          this.postTitleInput.getText(),
          tags,
          this.public.context.checked
        );
        this.close();
        atom.workspace.activatePreviousPane();
      });
  }

  toggleAuthModl(enabled) {
    if (this.postModal) enabled ? this.postModal.hide() : this.postModal.show();
    if (this.authModal) enabled ? this.authModal.show() : this.authModal.hide();
  }

  auth() {
    const authToken = localStorage.getItem(storageKey, '');
    return QiitaClient.auth(authToken);
  }

  updateAuthenticationStatuses(hasAuthenticated) {
    this.hasAuthenticated = hasAuthenticated;
    this.previewButton.context.style.display = hasAuthenticated ? '' : 'none';
    this.authButton.context.textContent = hasAuthenticated ? '認証解除' : '認証する';
    this.authButtonLabel.context.style.display = hasAuthenticated ? 'none' : '';
  }

  close() {
    this.postModal.hide();
    this.focusout();
  }

  getTitle() {
    return '';
  }
}
