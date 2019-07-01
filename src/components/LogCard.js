import React, { Component } from "react";
import Moment from "react-moment";

class LogCard extends Component {
  render() {
    return (
      <div className="log-event">
        <p className="log-event-timestamp"> 
          <span className="log-event-timestamp__relative"><Moment fromNow>{ this.props.log.timestamp }</Moment></span>
          <Moment format="dddd, MMMM Do YYYY" date={ this.props.log.timestamp } /> 
          <Moment format="h:mm:ss a" date={ this.props.log.timestamp } /> 
        </p>
        <main className="log-event-meta">
          <p className="log-event-message">{ this.props.log.message.replace(/\t/g, '\n') }</p>
          <p className="log-stream-display"><strong>Log Stream:</strong> { this.props.log.logStreamName }</p>
          <p className="log-id-display"><strong>Log ID:</strong> { this.props.log.eventId }</p>
        </main>
      </div>
    );
  }
}

export default LogCard;