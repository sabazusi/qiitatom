'use babel';

import { $, ScrollView } from 'atom-space-pen-views';
import { React, ReactDOM } from 'react-for-atom';
export default class ResultView extends ScrollView {
  static content() {
    this.div({
      'class' : 'search-result-view'
    });
  }

  constructor() {
    super();
  }

  initialize() {
    ReactDOM.render(<div style={{backgroundColor: '#ff0'}}>hogehoge</div>, this.element);
  }

  serialize() {}
  destroy() {}
  getTitle() { return 'Result: hoge'; }
  getUri() {return 'qiitatom://result-view';}
}
