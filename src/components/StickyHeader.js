import React from 'react';

const StickyHeader = (props) => {
	return (
		<section className="log-group-sticky-header"> {props.activeLogPanel.name}</section>
	)
}

export default StickyHeader;