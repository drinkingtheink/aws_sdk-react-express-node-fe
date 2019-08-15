import React from 'react';
import LogCard from './LogCard';

const BrowseLogSearchResults = (props) => {
	return (
	  <section className="browse-log-search-results">
	  	{ props.logSearchResults.map((result, index) => (
          <LogCard
	          log={ result }
	          key={ index }
	        />
        ))}
	  </section>
	);
}

export default BrowseLogSearchResults;