import React from 'react';

const UserFeedback = (props) => {
	return(
		<p className="user-feedback">
			{props.message}
		</p>
	)
}

export default UserFeedback;