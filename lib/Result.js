'use babel';

import { React, ReactDOM } from 'react-for-atom';
import ReactMarkdown from 'react-markdown';

export default class extends React.Component {
  constructor() {
    super();
    this.state = {
      currentContentId: null
    };
  }

  showContent() {
    const {
      currentContentId
    } = this.state;
    const {
      result
    } = this.props;
    return (
      <div>
        <div className="qiitatomBackToResultViewButton" onClick={() => this.setState({currentContentId: null})}><span>検索結果一覧に戻る</span></div>
        <ReactMarkdown source={result[currentContentId].body}/>
      </div>
    );
  }

  getContentList() {
    const {
      result
    } = this.props;
    return result.map((item, index) => {
      return (
        <div className="qiitatomResultViewItem" onClick={() => this.setState({currentContentId: index})}>
          <span className="qiitatomResultViewItemTitle">{item.title}</span> {item.user.name ? `by ${item.user.name}` : ''}
        </div>
      );
    });
  }

  getPager() {
    const {
      getContent,
      currentPage,
      totalPage
    } = this.props;
    const previousEnabled = currentPage !== 1;
    const nextEnabled = currentPage !== totalPage;
    return (
      <div className="qiitatomResultViewPager">
      {
        previousEnabled ? (
          <span onClick={() => getContent(currentPage - 1)}>前のページへ</span>
        ) : null
      }
      {
        nextEnabled ? (
          <span onClick={() => getContent(currentPage + 1)}>次のページへ</span>
        ) : null
      }
      </div>
    );
  }

  render() {
    const {
      result,
      query,
      currentPage,
      totalPage
    } = this.props;
    const {
      currentContentId
    } = this.state;
    return currentContentId !== null ? this.showContent() : (
      <div className="qiitatomResultViewContainer">
        <div className="qiitatomResultViewHeaderLabel">
          <span className="qiitatomSearchQuery">{query}</span> の検索結果({currentPage} / {totalPage}ページ)
        </div>
        <div className="qiitatomResultViewItemContainer">
          {this.getContentList()}
        </div>
        {this.getPager()}
      </div>
    );
  }
}
