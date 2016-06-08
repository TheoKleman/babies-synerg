import React from 'react'
var classNames = require('classnames')

export default class SpaceBar extends React.Component {
	constructor() {
		super()

	}

	render() {
		var spaceClasses = classNames({
			'space-bar': true
		})

		return(
			<div 
			className="space-bar-wrapper">
				<span className="space-bar-double"></span>
				<button
					className={spaceClasses}>Un projet digital à leur confier ?</button>
			</div>
		)
	}

}