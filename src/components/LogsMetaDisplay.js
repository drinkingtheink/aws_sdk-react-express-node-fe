import React from 'react';
import CountUp from 'react-countup';

const LogsMetaDisplay = ({ logCount = 0, searchedTerm = null, searchStartTime = null}) => {
	return(
		<section className="logs-meta-display">
			<p className="meta-field"><strong><CountUp duration={ 1 } end={ logCount } /></strong> Logs Found</p>
			{ searchedTerm 
				? <p className="meta-field">Searching for <strong>"{ searchedTerm }"</strong></p>
				: null
			}
		</section>
	)
}

export default LogsMetaDisplay;