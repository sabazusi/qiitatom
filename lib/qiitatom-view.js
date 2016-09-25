'use babel';

import { React } from 'react-for-atom';

export default class extends React.Component {
  onClickButton(e) {
    if (this.refs.input.value !== '') {
      this.props.onClickSearchButton();
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
