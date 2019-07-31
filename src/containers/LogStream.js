import React, { Component } from "react";
import LogCard from '../components/LogCard';
import LogsMetaDisplay from '../components/LogsMetaDisplay';


class LogStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      searchPending: false,
      userFeedback: null
    };
    this.digestMostRecentLogsResult = this.digestMostRecentLogsResult.bind(this);
    this.handleLogsFoundSuccessfully = this.handleLogsFoundSuccessfully.bind(this);
    this.stopSearchPending = this.stopSearchPending.bind(this);
    this.setUserFeedback = this.setUserFeedback.bind(this);
    this.clearUserFeedback = this.clearUserFeedback.bind(this);
  }

  getMostRecentLogs = async (logGroup) => {
    alert(`LETS GET EM ++++++++++++ ${this.props.group.logGroupUrl}`);
    this.clearUserFeedback();
    this.startSearchPending();
    const response = await fetch('/get-most-recent-logs');
    const body = await response.json();

    if (body.hasOwnProperty("error")) {
      this.setUserFeedback(body.message);
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

  getRandomString() {
    return Math.random().toString(20).substring(2, 15) + Math.random().toString(20).substring(2, 15);
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

  componentDidMount() {
    // this.getMostRecentLogs()
    //   .then(body => this.digestMostRecentLogsResult(body))
    //   .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="log-stream layout-panel">
        <h4>{this.props.group.logGroupTitle ? this.props.group.logGroupTitle : 'Log Stream'}</h4>
        <LogsMetaDisplay />

        {!this.state.logs 
          ? 'We got logs!!!!'
          : <button onClick={this.getMostRecentLogs}>Get Most Recent Logs</button>
        }

        {this.state.logs.map((log, index) => (
	        <LogCard
	          log={ log }
	          key={this.getRandomString()}
	        />
	      ))}
      </div>
    );
  }
}

export default LogStream;