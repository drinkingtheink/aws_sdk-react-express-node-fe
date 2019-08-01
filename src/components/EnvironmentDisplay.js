import React, { Component } from "react";
import Moment from "react-moment";
import logo from '../dnb_wordmark.svg';

const today = new Date();

class EnvironmentDisplay extends Component {
  constructor(props) {
    super(props);
    this.toggleLogGroup = this.toggleLogGroup.bind(this);
  }

  toggleLogGroup(logGroupIdex) {
    this.props.toggleLogGroups(logGroupIdex);
  }

  render() {
    let appName = this.props.appName || 'Log System';

    return (
      <div className="environment-display">
        <img 
          src={ logo } 
          className="dnb_logo" 
          alt="Dun and Bradstreet" 
        />

        <h3 className="todays-date"><Moment date={ today } format="MMMM Do YYYY" /></h3>

        {appName && this.props.companyName &&
          <section className="function-description">
            <h3 className="function-name">{ appName }</h3>
            <h4 className="function-attribution">for { this.props.companyName }</h4>
          </section>
        }

        <nav className="cls-navigation">
         <h4>Monitoring:</h4>
          {this.props.logGroups.map((group, index) => (
            <div 
              key={`log-groups-nav-item-${index}`}
              className={`sidenav-item ${group.active ? 'active' : ''}`}
              onClick={() => this.toggleLogGroup(index)}
            >            
              { group.logGroupTitle } { group.active ? <i className="fas fa-chevron-right"></i> : null }
            </div>
          ))}
        </nav>
      </div>
    );
  }
}

export default EnvironmentDisplay;