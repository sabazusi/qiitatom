'use babel';

import { React, ReactDOM } from 'react-for-atom';
import QiitaCliet from '../client';

export default class extends React.Component {
  constructor() {
    super();
    this.client = new QiitaCliet();
    this.state = {
      isSearchable: true,
      searchType  : 'keyword'
    };

    atom.keymaps.handleKeyboardEvent(event)
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this.refs.input);
    node.focus();
  }

  onClickButton(e) {
    const query = this.refs.input.value;
    if (query !== '') {
      this.setState({isSearchable: false});
      this.client.search(query, 1)
        .then((response) => {
          const result = response.data;
          if (result.length > 1) {
            this.props.onFetchSearchResult(result, query);
          }
          this.setState({isSearchable: true});
        })
        .catch(() => {
          alert('QiitaAPI: An error has occurred');
          this.setState({isSearchable: true});
          this.refs.input.value = '';
        });
    }
  }

  onChangeSearchType(e) {
    this.setState({searchType: e.target.value});
  }

  getSelectRadioBoxes() {
    return (
      <div className="searchTypeInput">
        検索:
        <label>
          <input
            type="radio"
            value="keyword"
            onChange={this.onChangeSearchType.bind(this)}
            checked={this.state.searchType === 'keyword'}
          />
          キーワード
        </label>
        <label>
          <input
            type="radio"
            value="tag"
            onChange={this.onChangeSearchType.bind(this)}
            checked={this.state.searchType === 'tag'}
          />
          タグ
        </label>
      </div>
    );
  }

  render() {
    return (

      <div className="modalContents">
        {this.getSelectRadioBoxes()}
        <input
          ref="input"
          className="searchInput"
        />
        <button
          className="searchButton"
          onClick={this.onClickButton.bind(this)}
          disabled={!this.state.isSearchable}
        >
          Search
        </button>
      </div>
    );
  }
}
