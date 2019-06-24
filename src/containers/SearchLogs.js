import React, { Component } from 'react';
import InProcessDisplay from '../components/InProcessDisplay';
import BrowseLogSearchResults from '../components/BrowseLogSearchResults';
import UserFeedback from '../components/UserFeedback';
import LogsMetaDisplay from '../components/LogsMetaDisplay';

const noSearchTermMessage = 'Enter your search term above and hit the button to begin your search.';
const searchingMessage = 'Searching Logs...'

class SearchLogs extends Component {
  constructor(props) {
    super(props);
    this.logSearchInput = React.createRef();
    this.state = {
      searchTerm: null,
      searchedTerm: null,
      searchPending: false,
      results: null,
      error: null,
      userFeedback: noSearchTermMessage
    };
    this.searchLogs = this.searchLogs.bind(this);
    this.onChange = this.onChange.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.digestSearchResults = this.digestSearchResults.bind(this);
    this.handleSearchResultsFound = this.handleSearchResultsFound.bind(this);
    this.handleNoSearchResultsFound = this.handleNoSearchResultsFound.bind(this);
  }

  onChange(event) {
    let safeTerm = event.target.value || null;
    this.setState({ searchTerm: safeTerm})
  }

  clearSearch() {
    this.setState({
      searchTerm: null,
      searchedTerm: null,
      searchPending: false,
      searchMeta: null,
      results: null,
      error: false,
      userFeedback: noSearchTermMessage
    })
  }

  searchLogs = async () => {
    let readyToSearch = this.state.searchTerm && this.state.searchTerm.length > 1;

    if (readyToSearch) {
      this.setState({ searchPending: true, results: null});
      const searchTerm = this.state.searchTerm || null;
      const response = await fetch(`/search-logs/${searchTerm}`);
      const body = await response.json();

      if (body.hasOwnProperty("error")) {
        alert(`WE'VE GOT AN ERROR >>> ${JSON.stringify(body)}`);
      } else {
        this.setState({ searchPending: false});
        this.digestSearchResults(body);
      }

    } else {
      return;
    }
  };  

  digestSearchResults (searchResponse) {
    let resultSet = searchResponse.payload || [];
    let searchMeta = searchResponse.meta || {};
    let searchResultsFound = resultSet.length > 0;
    if (searchResultsFound) {
      this.handleSearchResultsFound(resultSet, searchMeta);
    } else {
      this.handleNoSearchResultsFound(resultSet);
    }
  }

  handleNoSearchResultsFound () {
    this.setState({ userFeedback: 'No results found for your search term. Please adjust your credentials.', error: true });
  }

  handleSearchResultsFound (resultSet, searchMeta) {
    this.setState({ results: resultSet, searchMeta: searchMeta });
  }

  render() {
    let searchTermEntered = this.state.searchTerm !== null;
    let searchResultsFound = this.state.results && this.state.results.length > 0;

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

        { this.state.searchMeta
          ? <LogsMetaDisplay logCount={this.state.searchMeta.logCount} searchedTerm={this.state.searchMeta.searchedTerm} />
          : null
        }

        { searchResultsFound
          ? <BrowseLogSearchResults logSearchResults={this.state.results} />
          : null
        }

        { !searchResultsFound && !this.state.searchPending && !this.state.error
          ? <UserFeedback key={this.state.searchPending ? 'pending' : 'resolved'} message={ this.state.searchPending ? searchingMessage : noSearchTermMessage } />
          : null
        }

        { this.state.error
          ? <UserFeedback key="no-results-found-error" message="No results found for your current search. Please try a different term." />
          : null
        }

        { this.state.searchPending
          ? <InProcessDisplay />
          : null
        }
        
      </main>
    );
  }
}

export default SearchLogs;