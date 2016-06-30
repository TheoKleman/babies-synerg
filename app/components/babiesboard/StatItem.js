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
				<div className="stat-bar">
					<span style={statBarWidthStyle}></span>
					<p className={statBarPercentStyle}>{this.props.percent}</p>
				</div>
				<img src={statIcon} alt={this.props.statName}/>
				<p className="stat-name">{this.props.statName}</p>
			</div>
		);
	}
}