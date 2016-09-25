'use babel';

import { React } from 'react-for-atom';
import QiitaCliet from './client';

export default class extends React.Component {
  constructor() {
    super();
    this.client = new QiitaCliet();
    this.state = {
      isSearchable: true
    };
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
            this.setState({isSearchable: true});
          }
        })
        .catch(() => {
          alert('QiitaAPI: An error has occurred');
          this.setState({isSearchable: true});
        });
    }
  }

  render() {
    return (
      <div
        className="modal"
      >
        <input
          type="text"
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
        <button
          className="closeButton"
          onClick={this.props.onClickCancelButton}
        >
          Close
        </button>
      </div>
    );
  }
}
