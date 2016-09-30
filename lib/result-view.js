'use babel';

import { $, ScrollView } from 'atom-space-pen-views';
import { React, ReactDOM } from 'react-for-atom';
export default class ResultView extends ScrollView {
  static content() {
    this.div({
      'class' : 'search-result-view'
    });
  }

  constructor(result, query) {
    super();

    this.result = result;
    ReactDOM.render(<div style={{backgroundColor: '#ff0'}}>{this.parse(result)}</div>, this.element);
  }

  parse(items) {
    return items.map((item) => {
      return (
        <div>
          {item.title} { item.user.name ? `by ${item.user.name}` : ''}
        </div>
      )
    });
  }

  initialize() {}
  serialize() {}
  destroy() {}
  getTitle() { return 'Result: hoge'; }
  getUri() {return 'qiitatom://result-view';}
}
