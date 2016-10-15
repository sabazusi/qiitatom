'use babel';

import { $, ScrollView } from 'atom-space-pen-views';
import { React, ReactDOM } from 'react-for-atom';
import SearchResult from './components/SearchResult';
import QiitaClient from './client';

export default class extends ScrollView {
  static content() {
    this.div({
      outlet: 'viewContainer', class : 'qiitatomSearchResultView'
    });
  }

  constructor(query) {
    super();
    this.result = [];
    this.query = query || '';
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

    ReactDOM.render(
      <SearchResult
        result={result}
        query={query}
        currentPage={currentPage}
        totalPage={totalPage}
        getContent={this.getContent.bind(this)}
        isFetching={isFetching}
        getContentHeight={() => this.element.scrollHeight}
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
          alert('Error');
        });
    }
  }

  initializeView(result, apiName, totalPage) {
    this.result = result;
    this.apiName = apiName;
    this.totalPage = totalPage;
    this.render();
  }

  initialize() {}
  serialize() {}
  destroy() {}
  getTitle() { return `Result for "${this.query}":`; }
  getUri() {return 'qiitatom://result-view';}
}
