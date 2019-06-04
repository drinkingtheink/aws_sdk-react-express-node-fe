import React, { Component } from "react";

class LogCard extends Component {
  render() {
    return (
      <div className="log-event">
        <p><strong>Message:</strong> { this.props.log.message }</p>
        <p><strong>Occured:</strong> { this.props.log.timestamp }</p>
        <p><strong>Log Stream:</strong> { this.props.log.logStreamName }</p>
        <p><strong>Log ID:</strong> { this.props.log.eventId }</p>
      </div>
    );
  }
}

export default LogCard;