'use babel';

import {TextEditorView, View} from 'atom-space-pen-views';
import {CompositeDisposable} from 'atom';
import url from 'url';
import PostView from './post-view';

export default class extends View {
  static content() {
    this.div({class: 'qiitatompost'}, () => {
      this.div({class: 'qiitatomPostInput'}, () => {
        this.div({class: 'qiitatomPostInputTitle'}, () => {
          this.label({class: 'qiitatomPostLabelTitle'}, 'タイトル');
          this.subview('qiitatomPostTitle', new TextEditorView({mini: true, placeholderText: 'Title'}));
        });
        this.div({class: 'qiitatomPostInputVisibility'}, () => {
          this.input({outlet: 'public', class: 'qiitaPostVisiblityRadioButton', id: 'public', type: 'radio', value: 'title', name: 'visibilityType'});
          this.label({for: 'public', class: 'qiitaSearchRadioButtonLabel'}, '公開');
          this.input({outlet: 'private', class: 'qiitaPostVisiblityRadioButton', id: 'private', type: 'radio', value: 'tag', name: 'visibilityType', checked: 'checked'});
          this.label({for: 'private', class: 'qiitaSearchRadioButtonLabel'}, '非公開');
        });
        this.button({outlet: 'previewButton', class: 'qiitatomPostPreviewButton'}, 'プレビュー');
      });
    });
  }

  initialize() {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'qiitatom:post': () => {
        this.panel = atom.workspace.addModalPanel({
          item: this,
          visible: true
        });
        this.panel.show();
        this.qiitatomPostTitle.focus();
      }
    }));

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
    const target = atom.workspace.getActivePaneItem().getText();
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
