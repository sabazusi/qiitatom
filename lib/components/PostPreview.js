'use babel';

import { React, ReactDOM } from 'react-for-atom';
import ReactMarkdown from 'react-markdown';

export default class extends React.Component {
  render() {
    const {
      paneBody,
      title,
      isPublic,
      tags,
      onClickPost,
      onClickCancel
    } = this.props;
    return (
      <div className="qiitatom-post-preview">
        <div className="qiitatom-post-preview__forms">
          <div className="qiitatom-post-preview__forms__inputdetail">
            <span className="qiitatom-post-preview__forms__inputdetail--label-title">
              タイトル: <span>{title}</span>
            </span>
            <span className="qiitatom-post-preview__forms__inputdetail--label-tags">
              タグ: {tags.map((tag) => <span>{tag}</span>)}
            </span>
            <span className="qiitatom-post-preview__forms__inputdetail--label-isPublic">
              公開設定: <span>{isPublic ? "全員に公開する" : "限定共有する"}</span>
            </span>
          </div>
          <div className="qiitatom-post-preview__forms__buttons">
            <span className="qiitatom-post-preview__forms__buttons--label">
              下記の内容で投稿しますか？
            </span>
            <span
              className="qiitatom-post-preview__forms__buttons--button-ok"
              onClick={onClickPost}
            >
              はい
            </span>
            <span
              className="qiitatom-post-preview__forms__buttons--button-cancel"
              onClick={onClickCancel}
            >
              いいえ
            </span>
          </div>
        </div>
        <ReactMarkdown
          source={paneBody}
          className="qiitatom-markdown"
        />
      </div>
    );
  }
}
