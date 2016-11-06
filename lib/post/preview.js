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
    this.tagStr = '';
  }

  render(paneBody, title, tagStr, isPublic) {
    this.title = title;
    this.isPublic = isPublic;
    this.paneBody = paneBody  ;
    this.tagStr = tagStr;
    ReactDOM.render(
      <PostPreview
        paneBody={paneBody}
        onClickPost={::this.post}
        onClickCancel={::this.closePane}
      />, this.element);
  }

  post() {
    QiitaClient.post(this.paneBody, this.title, this.isPublic)
      .then((response) => {
        console.log(response);
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
