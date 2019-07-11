import React from 'react';

const LogsMetaDisplay = ({ logCount = 0, searchedTerm = null, searchStartTime = null}) => {
	return(
		<section className="logs-meta-display">
			<p className="meta-field"><strong>{logCount}</strong> Logs Found</p>
			{ searchedTerm 
				? <p className="meta-field">Searching for <strong>"{searchedTerm}"</strong></p>
				: null
			}
		</section>
	)
}

export default LogsMetaDisplay;