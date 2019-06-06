import React, { Component } from 'react';

class SearchLogs extends Component {
  state = {
    results: null,
    error: null
  };

  searchLogs = async () => {
  	const searchTerm = '34782794580844166648819421226037502596692741379168731136';
    const response = await fetch(`/get-log/${searchTerm}`);
    const body = await response.json();

    if (body.hasOwnProperty("error")) {
      alert(`WE'VE GOT AN ERROR >>> ${JSON.stringify(body)}`);
    } 

    return body;
  };  

  render() {
    return (
      <main className="logs-search">
        <h3>Search Logs:</h3>
        <input className="logs-search-input" />
        <button 
          className="log-search-button"
          onClick={this.searchLogs}
        >Search Logs</button>
      </main>
    );
  }
}

export default SearchLogs;