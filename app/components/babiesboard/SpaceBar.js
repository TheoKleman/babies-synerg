import React from 'react'
import GSAP from 'gsap'

var classNames = require('classnames')

export default class SpaceBar extends React.Component {

	constructor() {
		super()

		this.state = {
			isHovered: false,
			isSelected: false,
			clickDown: false,
			clickTO: null,
		}

		this.spaceBarProgression;
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.spacebarDown != this.props.spacebarDown) {
			if (nextProps.spacebarDown) {
				// spacebar progression animation
				if (this.spaceBarProgression) {
					this.spaceBarProgression.timeScale(5).reverse(0)
				}
				this.spaceBarProgression = new TweenMax.to(this.refs.keyContentProgress, 2.5, {
					width: "110%",
					ease: Power1.easeIn,
					onComplete: function(){
						setTimeout(function(){
							self.spaceBarProgression.timeScale(5).reverse(0)
						}, 500)
					}
				})
			} else {
				this.spaceBarProgression.timeScale(3).reverse()
			}
		}
	}

	handleMouseEnter() {
		this.setState({
			isHovered: true
		})
	}

	handleMouseLeave() {
		// reset spacebar progression animation
		if (this.spaceBarProgression) {
			this.spaceBarProgression.timeScale(3).reverse()
		}

		// Reset timeout & Reset progression
		clearTimeout(this.state.clickTO)
		clearInterval(this.state.clickProgress)

		this.setState({
			isHovered: false,
			isSelected: false,
			clickDown: false
		})

	}

	handleMouseDown(e) {
		var self = this

		this.setState({
			isSelected: true,
		})

		// spacebar progression animation
		if (this.spaceBarProgression) {
			this.spaceBarProgression.timeScale(5).reverse(0)
		}
		this.spaceBarProgression = new TweenMax.to(this.refs.keyContentProgress, 2.5, {
			width: "110%",
			ease: Power1.easeIn
		})

		if (!this.props.formDisplayed && !this.state.clickDown) {
			// Center board
			this.setState({
				clickDown: true,
				clickTO: setTimeout(function(){
					setTimeout(function(){
						self.spaceBarProgression.timeScale(5).reverse(0)
					}, 500)
					clearInterval(self.state.clickProgress)
					self.props.setFormIsDisplayedProps(true)
					self.props.centerBoard()
					self.setState({
						clickDown: false,
					})
				}, 2500),
			})
		}
	}

	handleMouseUp(e) {
		// reset spacebar progression animation
		this.spaceBarProgression.timeScale(3).reverse()

		// Reset timeout & Reset progression
		clearTimeout(this.state.clickTO)
		clearInterval(this.state.clickProgress)
		this.setState({
			isSelected: false,
			clickDown: false,
		})
	}

	render() {
		var spaceClasses = classNames({
			'spacebar': true,
			'key': true,
			'isPressed': this.props.spacebarDown || this.state.isSelected
		})

		return(
			<button
				ref="itSelf"
				className={spaceClasses}
				onMouseEnter={this.handleMouseEnter.bind(this)}
				onMouseLeave={this.handleMouseLeave.bind(this)}
				onMouseDown={this.handleMouseDown.bind(this)}
				onMouseUp={this.handleMouseUp.bind(this)}
				>
				<span className="key--content">
					Un projet digital a leur confier ?
					<div className="progress" ref="keyContentProgress"></div>
				</span>
				<span className="key--double"></span>
			</button>
		)
	}
}
