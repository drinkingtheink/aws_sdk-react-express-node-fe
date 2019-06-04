import React, { Component } from "react";
import LogCard from './LogCard';

class LogStream extends Component {
  render() {
    return (
      <div className="log-stream">
        <h3>Most Recent Logs:</h3>
        {this.props.logs.map((log, index) => (
	        <LogCard
	          log={ log }
	          key={ index }
	        />
	      ))}
      </div>
    );
  }
}

export default LogStream;