'use babel';

import { React, ReactDOM } from 'react-for-atom';
import ReactMarkdown from 'react-markdown';

export default class extends React.Component {
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
          className="qiitatom-markdown"
        />
      </div>
    );
  }
}
