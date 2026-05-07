import React, { Component } from 'react';

interface Props {
  onSearch: (value: string) => void;
  defaultValue: string;
}

class Search extends Component<Props> {
  state = {
    value: this.props.defaultValue,
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ value: e.target.value });
  };

  handleSubmit = () => {
    this.props.onSearch(this.state.value);
  };

  render() {
    return (
      <div className='search'>
        <input value={this.state.value} onChange={this.handleChange} />
        <button onClick={this.handleSubmit}>Search</button>
      </div>
    );
  }
}

export default Search;