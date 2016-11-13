'use babel';

import { $, View } from 'atom-space-pen-views';
import { React, ReactDOM } from 'react-for-atom';
import SearchResult from '../components/SearchResult';
import QiitaClient from '../client';

export default class extends View {
  static content() {
    this.div({
      outlet: 'viewContainer', class : 'qiitatomSearchResultView'
    });
  }

  constructor() {
    super();
    this.result = [];
    this.query = '';
    this.currentPage = 1;
    this.totalPage = 1;
    this.apiName = null;
    this.isFetching = false;
  }

  render() {
    const {
      result,
      query,
      currentPage,
      totalPage,
      isFetching
    } = this;
    // rerender for reseting scrollHeight :<
    ReactDOM.render(<div/>, this.element);
    ReactDOM.render(
      <SearchResult
        result={result}
        query={query}
        currentPage={currentPage}
        totalPage={totalPage}
        getContent={::this.getContent}
        isFetching={isFetching}
        getContentHeight={() => this.element.scrollHeight}
        rerender={::this.render}
      />, this.element);
  }

  getContent(page) {
    if (this.apiName) {
      this.isFetching = true;
      this.render();
      QiitaClient[this.apiName](this.query, page)
        .then((response) => {
          this.result = response.data;
          this.currentPage = page;
          this.isFetching = false;
          this.element.scrollTop = 0;
          this.render();
        })
        .catch(() => {
          this.isFetching = false;
          alert('投稿一覧の取得に失敗しました');
        });
    }
  }

  initializeView(result, apiName, query, totalPage) {
    this.result = result;
    this.apiName = apiName;
    this.query = query;
    this.totalPage = totalPage;
    this.render();
  }

  initialize() {}
  getTitle() { return `Qiitatom Search`; }
}
