import React from 'react';

const RecentLogsMetaDisplay = ({ logCount = 0}) => {
	return(
		<section className="recent-logs-meta">
			<p><strong>{logCount}</strong> Recent Logs Found</p>
		</section>
	)
}

export default RecentLogsMetaDisplay;