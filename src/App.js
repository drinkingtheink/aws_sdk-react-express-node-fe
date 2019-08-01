import React, { Component } from 'react';
import './App.scss';
import EnvironmentDisplay from './components/EnvironmentDisplay';
import SearchLogs from './containers/SearchLogs';
import LogStream from './containers/LogStream';
import UserFeedback from './components/UserFeedback';
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
      logGroups: [],
      appName: null,
      companyName: null
    };
    this.stopSearchPending = this.stopSearchPending.bind(this);
    this.toggleLogGroups = this.toggleLogGroups.bind(this);
    this.setUserFeedback = this.setUserFeedback.bind(this);
    this.clearUserFeedback = this.clearUserFeedback.bind(this);
    this.scrollToTopOfLogsStage = this.scrollToTopOfLogsStage.bind(this);
    this.digestLogMeta = this.digestLogMeta.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  
  // Logs -->
  getLogMeta = async () => {
    this.clearUserFeedback();
    this.startSearchPending();
    const response = await fetch('/get-log-meta');
    const body = await response.json();

    if (body.hasOwnProperty("error")) {
      this.setUserFeedback(body.message);
    } 

    return body;
  };

  digestLogMeta(logMeta) {
    this.setState({ logGroups: logMeta.logGroups });
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

  getRandomString() {
    return Math.random().toString(20).substring(2, 15) + Math.random().toString(20).substring(2, 15);
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
  toggleLogGroups(activeLogPanelIndex) {
      let composedGroups = Array.from(this.state.logGroups);
      composedGroups.forEach((panel) => {
        panel.active = false
      })
      composedGroups[activeLogPanelIndex].active = true;
      this.setState({ logGroups: composedGroups });
  }

  // Lifecycle -->
  componentDidMount() {
    this.getEnvironmentDetails()
      .then(res => this.setState({ appName: res.app_name, companyName: res.company_name, logGroups: res.processes }))
      .catch(err => console.log(err));
    
    this.getLogMeta()
      .then(body => this.digestLogMeta(body))
      .catch(err => console.log(err));
    
  }

  render() {
    let activeLogGroup = this.state.logGroups && this.state.logGroups.length > 0 ? this.state.logGroups.find(group => group.active ) : null;
    let activeGroupFound = !!(activeLogGroup);
    let safeActiveGroupPath = activeGroupFound ? activeLogGroup.logGroupUrl : null;

    return (
      <main className="App">
        <EnvironmentDisplay 
          appName={this.state.appName}
          companyName={this.state.companyName}
          logGroups={this.state.logGroups}
          toggleLogGroups={this.toggleLogGroups}
        />
        <section 
          ref={this.logsStage}
          className="logs-stage"
        >
        <StickyHeader scrollToTop={this.scrollToTopOfLogsStage} />

        <SearchLogs logGroupPath={safeActiveGroupPath} />
        
        <section className="logs-browser">
          <h3>Most Recent Logs:</h3>
         
          <section className="recent-log-display">
            {this.state.logGroups.map((group, index) => (
              <LogStream
                key={`log-group-${index}`}
                group={group}
              />
            ))}
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