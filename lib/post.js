'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import url from 'url';
import PostView from './post-view';

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
          this.label({class: 'qiitatom-post__inputs_tags-label'}, 'タグ');
          this.subview('postTagInput', new TextEditorView({mini: true, placeholderText: 'タグ（半角スペース区切りで複数入力できます）'}));
        });
        this.div({class: 'qiitatom-post__publicity'}, () => {
          this.input({outlet: 'public', class: 'qiitatom-post__publicity-button', id: 'public', type: 'radio', value: 'title', name: 'visibilityType'});
          this.label({for: 'public', class: 'qiitatom-post__publicity-label'}, '公開');
          this.input({outlet: 'private', class: 'qiitatom-post__publicity-button', id: 'private', type: 'radio', value: 'tag', name: 'visibilityType', checked: 'checked'});
          this.label({for: 'private', class: 'qiitatom-post__publicity-label'}, '非公開');
        });
        this.div({class: 'qiitatom-post__preview'}, () => {
          this.button({outlet: 'previewButton', class: 'qiitatom-post__preview-button'}, 'プレビューを表示する');
        });
      });
    });
  }

  initialize() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:post': () => {
        this.targetFileName.context.innerText = atom.workspace.getActivePaneItem().getTitle();
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
        this.panel.show();
        this.postTitleInput.focus();
      }
    }));

    this.previewButton.on('click', () => this.preview());
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

      if (protocol === 'qiitatompost:') return new PostView();
    });
  }

  preview() {
    const target = atom.workspace.getActiveTextEditor().getText();
    if (!target || target === '') {
      alert('Empty post')
      return;
    }
    atom.workspace.open('qiitatompost://preview', {split: 'right'})
      .then((view) => {
        view.render(target, this.qiitatomPostTitle.getText(), false);
        this.close();
        atom.workspace.activatePreviousPane();
      });
  }

  close() {
    this.panel.hide();
    this.focusout();
    this.qiitatomPostTitle.setText('');
  }

  getTitle() {
    return '';
  }
}
