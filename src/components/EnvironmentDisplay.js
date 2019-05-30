import React, { Component } from "react";

class EnvironmentDisplay extends Component {
  state = {
    company_name: null,
    company_duns: null,
    lambda_function: null
  };

  componentDidMount() {
    this.getEnvironmentDetails()
      .then(res => this.setState({ ...res }))
      .catch(err => console.log(err));
  }

  getEnvironmentDetails = async () => {
    const response = await fetch('/get-env');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };

  render() {
    return (
      <div className="environment-display">
        <h3>{ this.state.lambda_function } for { this.state.company_name }</h3>
      </div>
    );
  }
}

export default EnvironmentDisplay;