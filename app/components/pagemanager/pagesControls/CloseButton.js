import React from 'react'

export default class closeButton extends React.Component {
	constructor() {
		super()
	}

	render() {
		return(
			<button className="close-button" onClick={this.props.close.bind(this)}></button>
		);
	}

}