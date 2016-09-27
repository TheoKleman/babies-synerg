import React, { Component, PropTypes } from "react"

var classNames = require('classnames')

export default class StatItem extends Component {
	constructor() {
		super()
	}

	render() {

		var statBarWidthStyle = {
			width: this.props.percent
		}
		var statBarPercentStyle = {
			marginLeft: this.props.percent
		}

		var statIcon = "images/"+this.props.icon+".png"

		return (
			<div className="stat-item">
				<p className="stat-name"><span>{this.props.percent}</span>{this.props.statName}</p>
				<img src={statIcon} alt={this.props.statName}/>
			</div>
		);
	}
}