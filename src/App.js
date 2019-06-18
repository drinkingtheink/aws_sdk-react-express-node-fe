import React, { Component } from 'react';
import './App.scss';
import EnvironmentDisplay from './components/EnvironmentDisplay';
import SearchLogs from './containers/SearchLogs';
import LogStream from './components/LogStream';
import InProcessDisplay from './components/InProcessDisplay';
import UserFeedback from './components/UserFeedback';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: null,
      error: null,
      searchPending: false,
      searchPerformed: false,
      userFeedback: ''
    };
    this.stopSearchPending = this.stopSearchPending.bind(this);
    this.digestMostRecentLogsResult = this.digestMostRecentLogsResult.bind(this);
    this.handleLogsFoundSuccessfully = this.handleLogsFoundSuccessfully.bind(this);
  }
  
  getMostRecentLogs = async () => {
    this.startSearchPending();
    const response = await fetch('/get-most-recent-logs');
    const body = await response.json();

    if (body.hasOwnProperty("error")) {
      alert(`WE'VE GOT AN ERROR >>> ${JSON.stringify(body)}`);
    } 

    return body;
  };

  digestMostRecentLogsResult(logs) {
    let logGroup = logs || [];
    let logsFound = logGroup.length !== undefined;

    if (logsFound) {
      this.handleLogsFoundSuccessfully(logGroup);
    } else {
      this.handleNoLogsFound();
    }

    this.setState({ searchPerformed: true });
  }

  handleLogsFoundSuccessfully() {
    // this.setState({ logs: res.payload })
  }

  handleNoLogsFound() {
    this.setState({ userFeedback: 'No recent logs found.', searchPending: false });
  }

  componentDidMount() {
    this.getMostRecentLogs()
      .then(body => this.digestMostRecentLogsResult(body))
      .catch(err => console.log(err));
  }

  startSearchPending() {
    this.setState({ searchPending: true });
  }

  stopSearchPending() {
    this.setState({ searchPending: false });
  }

  render() {
    const logsAvailable = this.state.logs && this.state.logs.length > 0;

    return (
      <main className="App">
        <EnvironmentDisplay />
        <section className="logs-stage">
            <SearchLogs />
            <section className="log-display">
              <h3>Most Recent Logs:</h3>
              { this.state.searchPending
                ? <InProcessDisplay />
                : null
              }
              { logsAvailable
                ? <LogStream logs={ this.state.logs } />
                : null
              }
            </section>
            { this.state.userFeedback
              ? <UserFeedback message={this.state.userFeedback} />
              : null
            }
        </section>
      </main>
    );
  }
}

export default App;