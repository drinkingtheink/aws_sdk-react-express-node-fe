import React, { Component } from "react";
import Moment from "react-moment";
import logo from '../dnb_wordmark.svg';

const today = new Date();

class EnvironmentDisplay extends Component {
  state = {
    company_name: null,
    company_duns: null,
    app_name: null,
    todays_date: today
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
      	<img 
          src={ logo } 
          className="dnb_logo" 
          alt="Dun and Bradstreet" 
        />

        <h3 className="todays-date"><Moment date={ today } format="MMMM Do YYYY" /></h3>

		    {this.state.app_name && this.state.company_name &&
	        <section className="function-description">
            <h3 className="section-label">Monitoring: </h3>
            <h3 className="function-name">{ this.state.app_name }</h3>
            <h4 className="function-attribution">for { this.state.company_name }</h4>
          </section>
    	  }
      </div>
    );
  }
}

export default EnvironmentDisplay;