import React, { Component } from 'react';
import BrowseLogSearchResults from './BrowseLogSearchResults';

class SearchLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: null,
      searchPending: false,
      results: null,
      error: null
    };
    this.searchLogs = this.searchLogs.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(event) {
    let safeTerm = event.target.value || null;
    this.setState({ searchTerm: safeTerm})
  }

  searchLogs = async () => {
    let readyToSearch = this.state.searchTerm && this.state.searchTerm.length > 0;

    if (readyToSearch) {
      this.setState({ searchPending: true});
      const searchTerm = this.state.searchTerm || null;
      const response = await fetch(`/search-logs/${searchTerm}`);
      const body = await response.json();

      if (body.hasOwnProperty("error")) {
        alert(`WE'VE GOT AN ERROR >>> ${JSON.stringify(body)}`);
      } 

      this.setState({ searchPending: false});
      this.setState({ results: body.payload });
    } else {
      return;
    }
  };  

  render() {
    let searchResultsFound = this.state.results && this.state.results.length > 0;
    return (
      <main className="search-logs">
        <h3>Search Logs:</h3>
        <input 
          className="logs-search-input" 
          onChange={this.onChange}
        />
        <button 
          className="log-search-button"
          onClick={this.searchLogs}
        >Search Logs</button>


        { searchResultsFound
          ? <BrowseLogSearchResults logSearchResults={this.state.results} />
          : <p>-- Enter your search term above and hit the button to being your search --</p>
        }
        
      </main>
    );
  }
}

export default SearchLogs;