import React, { Component } from "react";
import Moment from "react-moment";
import logo from '../dnb_wordmark.svg';

const today = new Date();

class EnvironmentDisplay extends Component {
  constructor(props) {
    super(props);
    this.toggleLogPanel = this.toggleLogPanel.bind(this);
  }

  toggleLogPanel(logPanelIdex) {
    this.props.toggleLogPanels(logPanelIdex);
  }

  render() {
    return (
      <div className="environment-display">
        <img 
          src={ logo } 
          className="dnb_logo" 
          alt="Dun and Bradstreet" 
        />

        <h3 className="todays-date"><Moment date={ today } format="MMMM Do YYYY" /></h3>

        {this.props.appName && this.props.companyName &&
          <section className="function-description">
            <h3 className="function-name">{ this.props.appName }</h3>
            <h4 className="function-attribution">for { this.props.companyName }</h4>
          </section>
        }

        <nav className="cls-navigation">
         <h4>Monitoring:</h4>
          {this.props.logPanels.map((panel, index) => (
            <div 
              key={panel.name}
              className={`sidenav-item ${panel.active ? 'active' : ''}`}
              onClick={() => this.toggleLogPanel(index)}
            >            
              { panel.name } { panel.active ? <i className="fas fa-chevron-right"></i> : null }
            </div>
          ))}
        </nav>
      </div>
    );
  }
}

export default EnvironmentDisplay;