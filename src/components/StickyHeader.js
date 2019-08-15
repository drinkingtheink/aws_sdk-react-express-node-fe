import React from 'react';

const StickyHeader = (props) => {
	const scrollToTop = () => {
		props.scrollToTop();
	}

	return (
		<section className="log-group-sticky-header"> 
			<button 
				className="cls-action small"
				onClick={scrollToTop}
			>
				Back to Top
			</button>
		</section>
	)
}

export default StickyHeader;