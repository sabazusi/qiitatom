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
        <div onClick={() => this.setState({currentContentId: null})}>検索結果一覧に戻る</div>
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
        <div className="resultItem" onClick={() => this.setState({currentContentId: index})}>
          {item.title} {item.user.name ? `by ${item.user.name}` : ''}
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
      <div>
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
    return currentContentId ? this.showContent() : (
      <div>
        {query} の検索結果({currentPage} / {totalPage}ページ)
        {this.getContentList()}
        {this.getPager()}
      </div>
    );
  }
}
