import React, { Component } from "react";
import LogCard from '../components/LogCard';
import LogsMetaDisplay from '../components/LogsMetaDisplay';
import InProcessDisplay from '../components/InProcessDisplay';
import UserFeedback from '../components/UserFeedback';

class LogStream extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: [],
      searchMeta: null,
      searchPending: false,
      userFeedback: null
    };
    this.digestMostRecentLogsResult = this.digestMostRecentLogsResult.bind(this);
    this.handleLogsFoundSuccessfully = this.handleLogsFoundSuccessfully.bind(this);
    this.stopSearchPending = this.stopSearchPending.bind(this);
    this.startSearchPending = this.startSearchPending.bind(this);
    this.setUserFeedback = this.setUserFeedback.bind(this);
    this.clearUserFeedback = this.clearUserFeedback.bind(this);
    this.initGetLogs = this.initGetLogs.bind(this);
  }

  initGetLogs() {
    this.getMostRecentLogs()
      .then(body => this.digestMostRecentLogsResult(body))
      .then(() => this.stopSearchPending())
      .catch(err => console.log(err));
  }

  getMostRecentLogs = async () => {
    this.clearUserFeedback();
    this.startSearchPending();
    const response = await fetch(`/get-most-recent-logs?path=${this.props.group.logGroupUrl.trim()}`);
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
    if (this.state.logs.length === 0) {
      this.initGetLogs();
      this.startSearchPending();
    } 
  }

  render() {
   let logsFound = this.state.logs && this.state.logs.length && this.state.logs.length > 0;
   let logCount = logsFound ? this.state.logs.length : 0;
   let safeDisplayFlag = !!(this.props.showLogStream) ? this.props.showLogStream : false;

    return (
      <div className={`log-stream layout-panel ${safeDisplayFlag ? 'display-panel' : 'hide-panel'}`}>
        <h4 className="log-group-title">{this.props.group.logGroupTitle ? this.props.group.logGroupTitle : 'Log Stream'}</h4>
        <LogsMetaDisplay logCount={logCount} />

        {this.state.searchPending
          ? <InProcessDisplay />
          : null
        }

        {this.state.logs.map((log, index) => (
	        <LogCard
	          log={ log }
	          key={ log.eventId }
	        />
	      ))}

        {this.state.userFeedback && !this.state.searchPending
          ? <UserFeedback message={this.state.userFeedback} />
          : null
        }
      </div>
    );
  }
}

export default LogStream;