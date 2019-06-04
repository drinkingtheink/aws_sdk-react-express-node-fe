import React, { Component } from "react";
import Moment from "react-moment";

class LogCard extends Component {
  render() {
    return (
      <div className="log-event">
        <p className="log-event-timestamp">&raquo;  
          <Moment format="dddd, MMMM Do YYYY, h:mm:ss a" date={ this.props.log.timestamp } /> 
          <span className="log-event-timestamp__relative">(<Moment fromNow>{ this.props.log.timestamp }</Moment>)</span>
        </p>
        <p className="log-event-message"><strong>Message:</strong> { this.props.log.message }</p>
        <p><strong>Log Stream:</strong> { this.props.log.logStreamName }</p>
        <p><strong>Log ID:</strong> { this.props.log.eventId }</p>
      </div>
    );
  }
}

export default LogCard;