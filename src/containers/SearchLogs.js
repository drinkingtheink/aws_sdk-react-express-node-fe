import React, { Component } from 'react';
import BrowseLogSearchResults from '../components/BrowseLogSearchResults';

class SearchLogs extends Component {
  constructor(props) {
    super(props);
    this.logSearchInput = React.createRef();
    this.state = {
      searchTerm: null,
      searchPending: false,
      results: null,
      error: null
    };
    this.searchLogs = this.searchLogs.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
  }

  onChange(event) {
    let safeTerm = event.target.value || null;
    this.setState({ searchTerm: safeTerm})
  }

  clearSearch() {
    this.setState({
      searchTerm: null,
      searchPending: false,
      results: null,
      error: null
    })
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
    let searchTermEntered = this.state.searchTerm !== null;
    let searchResultsFound = this.state.results && this.state.results.length > 0;
    const noSearchTermMessage = '-- Enter your search term above and hit the button to being your search --';
    const searchingMessage = '-- Searching Logs --'

    return (
      <main className="search-logs">
        <h3>Search Logs:</h3>
        <input 
          className="logs-search-input" 
          onChange={this.onChange}
          ref={this.logSearchInput}
        />
        <button 
          className="log-search-button cls-action"
          onClick={this.searchLogs}
          disabled={this.state.searchPending}
        >Search</button>

        { searchResultsFound || searchTermEntered
          ? <button className="clear-search-button secondary cls-action" onClick={this.clearSearch} disabled={this.state.searchPending ? true : false}>Clear Search</button>
          : null
        }

        { searchResultsFound
          ? <BrowseLogSearchResults logSearchResults={this.state.results} />
          : null
        }

        { !searchResultsFound
          ? <p className="feedback">{ this.state.searchPending ? searchingMessage : noSearchTermMessage }</p>
          : null
        }
        
      </main>
    );
  }
}

export default SearchLogs;