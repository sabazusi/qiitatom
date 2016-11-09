'use babel';

import shell from 'shell';
import { $, ScrollView } from 'atom-space-pen-views';
import { React, ReactDOM } from 'react-for-atom';
import ReactMarkdown from 'react-markdown';
import QiitaClient from '../client';
import PostPreview from '../components/PostPreview';

export default class extends ScrollView {
  static content() {
    this.div({
      'class' : 'qiitatomSearchResultView'
    });
  }
  constructor() {
    super();

    this.title = '';
    this.isPublic = false;
    this.paneBody = '';
    this.tags = [];
  }

  render(paneBody, title, tags, isPublic) {
    this.title = title;
    this.isPublic = isPublic;
    this.paneBody = paneBody  ;
    this.tags = tags;
    ReactDOM.render(
      <PostPreview
        paneBody={paneBody}
        title={title}
        isPublic={isPublic}
        tags={tags}
        onClickPost={::this.post}
        onClickCancel={::this.closePane}
      />, this.element);
  }

  post() {
    QiitaClient.post(this.paneBody, this.title, this.isPublic)
      .then((response) => {
        shell.openExternal(response.data.url);
        this.closePane();
      })
      .catch(() => alert('投稿に失敗しました'));
  }

  closePane() {
    atom.workspace.paneForItem(this).destroy();
  }

  getTitle() { return 'post-preview'; }
}
