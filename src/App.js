import React, { Component } from 'react';
import './App.scss';
import EnvironmentDisplay from './components/EnvironmentDisplay';
import SearchLogs from './containers/SearchLogs';
import LogStream from './components/LogStream';
import InProcessDisplay from './components/InProcessDisplay';
import UserFeedback from './components/UserFeedback';
import LogsMetaDisplay from './components/LogsMetaDisplay';
import StickyHeader from './components/StickyHeader';

class App extends Component {
  constructor(props) {
    super(props);
    this.logsStage = React.createRef();
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
    this.toggleLogPanels = this.toggleLogPanels.bind(this);
    this.setUserFeedback = this.setUserFeedback.bind(this);
    this.clearUserFeedback = this.clearUserFeedback.bind(this);
    this.scrollToTopOfLogsStage = this.scrollToTopOfLogsStage.bind(this);
  }
  
  // Logs -->
  getMostRecentLogs = async () => {
    this.clearUserFeedback();
    this.startSearchPending();
    const response = await fetch('/get-most-recent-logs');
    const body = await response.json();

    if (body.hasOwnProperty("error")) {
      this.setUserFeedback(body);
    } 

    return body;
  };

  digestMostRecentLogsResult(searchResults) {
    let logMeta = searchResults.meta || {};
    let logGroup = searchResults.payload || [];
    let logsFound = logGroup !== undefined && logGroup.length && logGroup.length > 0;

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

  setUserFeedback(message) {
    this.setState({ userFeedback: message });
  }

  clearUserFeedback() {
    this.setState({ userFeedback: null });
  }

  scrollToTopOfLogsStage() {
    this.logsStage.current.scrollTop = 0;
  }

  // Environment Details -->
  getEnvironmentDetails = async () => {
    const response = await fetch('/get-env');
    let body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    
    //  otherwise, compose nav items
    body.processes.forEach((process) => {
      process.active = false;
    });
    
    body.processes[0].active = true;
    return body;
  };

  // Navigation -->
  toggleLogPanels(activeLogPanelIndex) {
      let composedPanels = Array.from(this.state.logPanels);
      composedPanels.forEach((panel) => {
        panel.active = false
      })
      composedPanels[activeLogPanelIndex].active = true;
      this.setState({ logPanels: composedPanels });
  }

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
    const activeLogPanel = this.state.logPanels.find(function(panel) {return panel.active;});
    const activeLogPanelFound = !!(activeLogPanel);

    return (
      <main className="App">
        <EnvironmentDisplay 
          appName={this.state.appName}
          companyName={this.state.companyName}
          logPanels={this.state.logPanels}
          toggleLogPanels={this.toggleLogPanels}
        />
        <section 
          ref={this.logsStage}
          className="logs-stage"
        >
            { activeLogPanelFound
              ? <StickyHeader 
                  activeLogPanel={activeLogPanel} 
                  scrollToTop={this.scrollToTopOfLogsStage}
                />
              : null
            }

            <SearchLogs activeLogGroup={activeLogPanelFound ? activeLogPanel.name : null} />
            <section className="logs-browser">
              <h3>Most Recent { activeLogPanelFound ? activeLogPanel.name : null} Logs:</h3>
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