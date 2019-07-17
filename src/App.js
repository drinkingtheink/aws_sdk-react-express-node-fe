import React, { Component } from 'react';
import './App.scss';
import EnvironmentDisplay from './components/EnvironmentDisplay';
import SearchLogs from './containers/SearchLogs';
import LogStream from './components/LogStream';
import InProcessDisplay from './components/InProcessDisplay';
import UserFeedback from './components/UserFeedback';
import LogsMetaDisplay from './components/LogsMetaDisplay';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: null,
      error: null,
      searchPending: false,
      searchMeta: null,
      userFeedback: '',
      logPanels: [],
      appName: null,
      companyName: null
    };
    this.stopSearchPending = this.stopSearchPending.bind(this);
    this.digestMostRecentLogsResult = this.digestMostRecentLogsResult.bind(this);
    this.handleLogsFoundSuccessfully = this.handleLogsFoundSuccessfully.bind(this);
  }
  
  // Logs -->
  getMostRecentLogs = async () => {
    this.startSearchPending();
    const response = await fetch('/get-most-recent-logs');
    const body = await response.json();

    if (body.hasOwnProperty("error")) {
      alert(`WE'VE GOT AN ERROR >>> ${JSON.stringify(body)}`);
    } 

    return body;
  };

  digestMostRecentLogsResult(searchResults) {
    let logMeta = searchResults.meta || {};
    let logGroup = searchResults.payload || [];
    let logsFound = logGroup !== undefined;

    if (logsFound) {
      this.handleLogsFoundSuccessfully(logGroup, logMeta);
    } else {
      this.handleNoLogsFound();
    }
  }

  handleLogsFoundSuccessfully(logGroup, logMeta) {
    this.setState({ logs: logGroup, searchMeta: logMeta });
    this.stopSearchPending();
  }

  handleNoLogsFound() {
    this.setState({ userFeedback: 'No recent logs found.', searchPending: false });
    this.stopSearchPending();
  }

  startSearchPending() {
    this.setState({ searchPending: true });
  }

  stopSearchPending() {
    this.setState({ searchPending: false });
  }

  // Environment Details -->
  getEnvironmentDetails = async () => {
    const response = await fetch('/get-env');
    let body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    
    body.processes.forEach((process) => {
      process.active = false;
    });
    
    body.processes[0].active = true;

    console.log(`ENV BODY >>>>>>>> ${JSON.stringify(body)}`);
    return body;
  };

  // Lifecycle -->
  componentDidMount() {
    this.getEnvironmentDetails()
      .then(res => this.setState({ appName: res.app_name, companyName: res.company_name, logPanels: res.processes }))
      .catch(err => console.log(err));

    this.getMostRecentLogs()
      .then(body => this.digestMostRecentLogsResult(body))
      .catch(err => console.log(err));
  }

  render() {
    const logsAvailable = this.state.logs && this.state.logs.length > 0;

    return (
      <main className="App">
        <EnvironmentDisplay 
          appName={this.state.appName}
          companyName={this.state.companyName}
          logPanels={this.state.logPanels}
        />
        <section className="logs-stage">
            <SearchLogs />
            <section className="logs-browser">
              <h3>Most Recent Logs:</h3>
              { logsAvailable && this.state.searchMeta
                ? <LogsMetaDisplay logCount={this.state.searchMeta.logCount} searchStartTime={this.state.searchMeta.searchStartTime} />
                : null
              }
              <section className="recent-log-display">
                { this.state.searchPending
                  ? <InProcessDisplay />
                  : null
                }

                { logsAvailable
                  ? <LogStream logs={this.state.logs} />
                  : null
                }
              </section>
              { this.state.userFeedback
                ? <UserFeedback message={this.state.userFeedback} />
                : null
              }
            </section>
        </section>
      </main>
    );
  }
}

export default App;