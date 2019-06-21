import React from 'react';

const LogsMetaDisplay = ({ logCount = 0, searchedTerm = null}) => {
	return(
		<section className="recent-logs-meta">
			<p><strong>{logCount}</strong> Recent Logs Found</p>
			{ searchedTerm 
				? <p>Searching for <strong>"{searchedTerm}"</strong></p>
				: null
			}
			
		</section>
	)
}

export default LogsMetaDisplay;