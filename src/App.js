import React, { Component } from 'react';
import './App.scss';
import EnvironmentDisplay from './components/EnvironmentDisplay';
import SearchLogs from './containers/SearchLogs';
import LogStream from './components/LogStream';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    logs: null,
    error: null
    };
    this.handleSearchClick = this.handleSearchClick.bind(this);
  }
  
  getMostRecentLogs = async () => {
    const response = await fetch('/get-most-recent-logs');
    const body = await response.json();

    if (body.hasOwnProperty("error")) {
      alert(`WE'VE GOT AN ERROR >>> ${JSON.stringify(body)}`);
    } 

    return body;
  };

  handleSearchClick () {
    this.getMostRecentLogs()
      .then(res => this.setState({ logs: res.payload }))
      .catch(err => console.log(err));
  }

  render() {
    const logsAvailable = this.state.logs && this.state.logs.length > 0;

    return (
      <main className="App">
        <EnvironmentDisplay />
        <section className="logs-stage">
            <SearchLogs />
            <section className="log-display">
              { logsAvailable
                ? <LogStream logs={ this.state.logs } />
                : <button className="search-recent-logs" onClick={this.handleSearchClick}>Get Most Recent Logs</button>
              }
            </section>
        </section>
      </main>
    );
  }
}

export default App;