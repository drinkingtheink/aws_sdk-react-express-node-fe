import React from "react";
import Moment from "react-moment";
import logo from '../dnb_wordmark.svg';

const today = new Date();

const EnvironmentDisplay = (props) => {
  return (
    <div className="environment-display">
    	<img 
        src={ logo } 
        className="dnb_logo" 
        alt="Dun and Bradstreet" 
      />

      <h3 className="todays-date"><Moment date={ today } format="MMMM Do YYYY" /></h3>

	    {props.appName && props.companyName &&
        <section className="function-description">
          <h3 className="function-name">{ props.appName }</h3>
          <h4 className="function-attribution">for { props.companyName }</h4>
        </section>
  	  }

      <nav className="cls-navigation">
       <h4>Monitoring:</h4>
        {props.logPanels.map((panel, index) => (
          <article className="sidenav-item">{ panel.name }</article>
        ))}
      </nav>
    </div>
  );
}

export default EnvironmentDisplay;