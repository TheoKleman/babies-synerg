import React from 'react'

export default class closeButton extends React.Component {
	constructor() {
		super()
	}

	render() {
		return(
			<a className="close-button" onClick={this.props.close.bind(this)}>Close</a>
		);
	}

}