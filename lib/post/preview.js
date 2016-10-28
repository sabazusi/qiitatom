'use babel';

import shell from 'shell';
import { $, ScrollView } from 'atom-space-pen-views';
import { React, ReactDOM } from 'react-for-atom';
import ReactMarkdown from 'react-markdown';
import QiitaClient from '../client';

class View extends React.Component {
  render() {
    return (
      <div>
        <div className="qiitatomPostPreviewConfirmLabel">
          下記の内容で投稿しますか？
        </div>
        <div className="qiitatomPostPreviewConfirm">
          <span className="qiitatomPostOK" onClick={this.props.onClickPost}>はい</span>
          <span className="qiitatomPostCancel" onClick={this.props.onClickCancel}>いいえ</span>
        </div>
        <ReactMarkdown
          source={this.props.paneBody}
        />
      </div>
    );
  }
}

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
    this.paneBody = paneBody;
    this.tagStr = tagStr;
    ReactDOM.render(
      <View
        paneBody={paneBody}
        onClickPost={this.post.bind(this)}
        onClickCancel={this.cancel.bind(this)}
      />, this.element);
  }

  post() {
    QiitaClient.post(this.paneBody, this.title, this.isPublic)
      .then((response) => {
        console.log(response);
        shell.openExternal(response.data.url);
      })
      .catch(() => alert('Error'));
  }

  cancel() {
    console.log(atom.workspace.getPaneItems());
  }

  initialize() {}
  serialize() {}
  destroy() {}
  getTitle() { return 'post-preview'; }
  getUri() {return 'qiitatompost://preview';}
}
