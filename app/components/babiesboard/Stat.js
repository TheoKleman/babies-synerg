import React, { Component, PropTypes } from "react"
import GSAP from 'gsap'

import StatItem from "./StatItem"

var classNames = require('classnames')

export default class Stat extends Component {
	constructor() {
		super()
	}

	shouldComponentUpdate(nextProps, nextState) {
		
		if(nextProps.isSorted != this.props.isSorted) {
			return true
		}
		return false
	}

	componentDidMount() {
		// Tweenmax here
		TweenMax.to(
			this.refs.itSelf,
			2,
			{
				opacity: 1,	
				scale: 1,
				ease: Power2.easeOut,
				delay: 3,
			}
		)
	}

	render() {

		var groupBtnClasses = classNames({
			'key': true,
		})

		if(this.props.groupId == "devs-stat") {
			var item1 = <StatItem
							percent="60%"
							icon="candy-crush-saga"
							statName="GTA"/>
			var item2 = <StatItem 
							percent="40%"
							icon="angry-birds"
							statName="FIFA"/>
		}
		if(this.props.groupId == "creatifs-stat") {
			var item1 = <StatItem 
							percent="71.2%"
							icon="angry-birds"
							statName="Angry Birds"/>
			var item2 = <StatItem
							percent="28.8%"
							icon="candy-crush-saga"
							statName="Candy Crush Saga"/>
		}
		if(this.props.groupId == "cdps-stat") {
			var item1 = <StatItem 
							percent="76.2%"
							icon="angry-birds"
							statName="Maitre Jedi"/>
			var item2 = <StatItem
							percent="23.8%"
							icon="candy-crush-saga"
							statName="Seigneur Sith"/>
		}
		if(this.props.groupId == "marketeux-stat") {
			var item1 = <StatItem
							percent="58.3%"
							icon="candy-crush-saga"
							statName="House of Cards"/>
			var item2 = <StatItem 
							percent="41.7%"
							icon="angry-birds"
							statName="Game of Thrones"/>
		}

		return(
			<div
				ref="itSelf"
				id={this.props.groupId}
				className="stat-container">
				<button
					ref="btnGroup"
					className={groupBtnClasses}
					>
					<span className="key--content">{this.props.groupCount} {this.props.groupName}</span>
					<span className="key--double"></span>
				</button>
				<div className="agency-stat">
					<span className="agency-stat__percent">{this.props.statPercent}</span>
					<p className="agency-stat__text">ont effectué leur stage dans une agence <span>(2015-2016)</span></p>
				</div>
				<div className="fun-stat">
					<p>Ils jouent à :</p>
					<div className="fun-stat-items">
						{item1}
						{item2}
					</div>
				</div>
			</div>
		);
	}

}
