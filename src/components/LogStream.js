import React, { Component } from "react";
import LogCard from './LogCard';

class LogStream extends Component {
  getRandomString() {
    return Math.random().toString(20).substring(2, 15) + Math.random().toString(20).substring(2, 15);
  }

  render() {
    return (
      <div className="log-stream layout-panel">
        {this.props.logs.map((log, index) => (
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