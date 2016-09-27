'use babel';

import { View } from 'atom-space-pen-views';
export default class extends View {
  static content() {
    return this.div( {class: "view" } );
  }

  constructor() {
    super();
  }

  initialize() {
    this.text('ahahahah');
  }

  getTitle() {
    return 'Result: hoge';
  }
}
