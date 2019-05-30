import React, { Component } from "react";

class LogCard extends Component {
  render() {
    return (
      <div className="log-event">
        <p>{ this.props.log.message }</p>
      </div>
    );
  }
}

export default LogCard;