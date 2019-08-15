import React from "react";
import Moment from "react-moment";

const LogCard = (props) => {
  return (
    <div className="log-event">
      <p className="log-event-timestamp"> 
        <span className="log-event-timestamp__relative"><Moment fromNow>{ props.log.timestamp }</Moment></span>
        <Moment format="dddd, MMMM Do YYYY" date={ props.log.timestamp } /> 
        <span className="timestamp-time-display"><Moment format="h:mm:ss a" date={ props.log.timestamp } /> </span>
      </p>
      <main className="log-event-meta">
        <p className="log-event-message">{ props.log.message.replace(/\t/g, '\n') }</p>
        <p className="log-stream-display secondary-field"><strong>Log Stream:</strong> { props.log.logStreamName }</p>
        <p className="log-id-display secondary-field"><strong>Log ID:</strong> { props.log.eventId }</p>
      </main>
    </div>
  );
}

export default LogCard;