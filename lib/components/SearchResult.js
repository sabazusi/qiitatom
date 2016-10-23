'use babel';

import { React, ReactDOM } from 'react-for-atom';
import ReactMarkdown from 'react-markdown';

export default class extends React.Component {
  constructor() {
    super();
    this.searchResultContainerHeight = 0;
    this.state = {
      currentContentId: null,
      coverHeight: 0
    };
  }

  componentWillReceiveProps() {
    this.searchResultContainerHeight = 0; // change page
    this.setState({
      coverHeight: 0
    });
  }

  componentDidMount() {
    this.setState({
      coverHeight: this.props.getContentHeight()
    }, () => {
      this.searchResultContainerHeight = this.state.coverHeight;
    });
  }

  componentDidUpdate() {
    const coverHeight = this.props.getContentHeight();
    if (this.state.coverHeight !== coverHeight) this.setState({coverHeight});
    if (this.state.currentContentId === null) {
      if (this.searchResultContainerHeight === 0) {
        this.searchResultContainerHeight = coverHeight;
      } else {
        this.props.rerender();
      }
    }
  }

  showContent() {
    const {
      currentContentId
    } = this.state;
    const {
      result
    } = this.props;
    const target = result[currentContentId];

    return target ? (
      <div>
        <div className="qiitatomBackToResultViewButton" onClick={() => this.setState({currentContentId: null})}>
          <span>検索結果一覧に戻る</span>
          <span>{target.title}</span>
        </div>
        <ReactMarkdown
          className="qiitatom__result__content-container"
          source={target.body}
        />
      </div>
    ) : null;
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
      totalPage,
      isFetching
    } = this.props;
    const {
      coverHeight
    } = this.state;

    const {
      currentContentId
    } = this.state;
    return currentContentId !== null ? this.showContent() : (
      <div className="qiitatomResultViewContainer" ref="container">
        <div
          className="qiitatom__searchresult__cover"
          style={{height: coverHeight, visibility: isFetching ? '' : 'hidden'}}
        />
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
