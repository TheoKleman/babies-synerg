import React, { Component, PropTypes } from "react"
import GSAP from 'gsap'

import StatItem from "./StatItem"

var classNames = require('classnames')

export default class Stat extends Component {
	constructor() {
		super()

		this.state = {
			isSelected: false,
			isHovered: false
		}

		this.oupsAudio = document.createElement('audio');
		this.oupsAudio.src = './media/oups.wav'
		this.youhouAudio = document.createElement('audio');
		this.youhouAudio.src = './media/youhou.wav'
		this.coucouAudio = document.createElement('audio');
		this.coucouAudio.src = './media/coucou.wav'
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.isSorted != this.props.isSorted) {
			return true
		} else if (nextState.isSelected != this.state.isSelected) {
			return true
		} else {
			return false
		}
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

	handleMouseEnter(){
		this.setState({
			isHovered: true
		})
	}

	handleMouseLeave(){
		this.setState({
			isHovered: false,
			isSelected: false
		})
	}

	handleMouseDown(){
		this.setState({
			isSelected: true,
		})
		// play sound
		if (this.props.isSoundActive) {
			if (this.props.groupId == "devs-stat") {
				this.oupsAudio.play()
			} else if (this.props.groupId == "creatifs-stat") {
				this.youhouAudio.play()
			} else if (this.props.groupId == "marketeux-stat" || this.props.groupId == "cdps-stat") {
				this.coucouAudio.play()
			}
		}
	}

	handleMouseUp(){
		this.setState({
			isSelected: false,
		})
	}

	render() {
		if(this.props.groupId == "devs-stat") {
			var item1 = <StatItem
							percent="60%"
							icon="gta"
							statName="Jouent à GTA"/>
		}
		if(this.props.groupId == "creatifs-stat") {
			var item1 = <StatItem 
							percent="71.2%"
							icon="angry-birds"
							statName="Jouent à Angry Birds"/>
		}
		if(this.props.groupId == "cdps-stat") {
			var item1 = <StatItem 
							percent="76.2%"
							icon="jedi"
							statName="Préfèrent Maitre Jedi à seigneur Sith"/>
		}
		if(this.props.groupId == "marketeux-stat") {
			var item1 = <StatItem
							percent="58.3%"
							icon="house-of-cards"
							statName="Préfèrent House of Cards à Games of Thrones"/>
		}

		var playOrPrefer = this.props.playOrPrefer == "play" ? "jouent à :" : "aiment regarder: "

		// Class selected
		var groupBtnClasses = "key"
		if (this.state.isSelected) {			
			groupBtnClasses += " selected"
		}

		return(
			<div
				ref="itSelf"
				id={this.props.groupId}
				className="stat-container">
				<button
					ref="btnGroup"
					className={groupBtnClasses}
					onMouseEnter={this.handleMouseEnter.bind(this)}
					onMouseLeave={this.handleMouseLeave.bind(this)}
					onMouseDown={this.handleMouseDown.bind(this)}
					onMouseUp={this.handleMouseUp.bind(this)}
					>
					<span className="key--content">{this.props.groupCount} {this.props.groupName}</span>
					<span className="key--double"></span>
				</button>
				<div className="agency-stat">
					<span className="agency-stat__percent">{this.props.statPercent}</span>
					<p className="agency-stat__text">ont effectué leur stage dans une agence <span>(2015-2016)</span></p>
				</div>
				<div className="fun-stat">
					<div className="fun-stat-items">
						{item1}
					</div>
				</div>
			</div>
		);
	}

}
