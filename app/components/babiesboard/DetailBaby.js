import React, { Component, PropTypes } from "react"
import GSAP from 'gsap'

var classNames = require('classnames')

export default class DetailBaby extends Component {
	constructor() {
		super()

	}

	componentWillUpdate(nextProps) {
		if(nextProps.isDisplayedBabyDetail) {
			this.hideDetail()
		} else {
			this.showDetail()
		}
	}

	showDetail() {
		if(!this.props.isDisplayed) {
			var self = this

			TweenMax.to(this.refs.detail, .5, {
				opacity: 1,
				ease: Power2.easeOut,
				onStart: function(){
                    self.refs.detail.className += ' displayed';
                }
			})
		}
	}

	hideDetail() {
		var self = this

		TweenMax.to(this.refs.detail, .5, {
			opacity: 0,
			ease: Power2.easeOut,
			onComplete: function() {
				self.refs.detail.className += ' baby-detail';
			}
		})
	}

	isBlue(value) {
		if(value == "blue")
			return true
		else
			return false
	}
	isOrange(value) {
		if(value == "orange")
			return true
		else
			return false
	}
	isYellow(value) {
		if(value == "yellow")
			return true
		else
			return false
	}
	isGreen(value) {
		if(value == "green")
			return true
		else
			return false
	}

	componentDidUpdate() {
		if(this.props.isDisplayedBabyDetail) {
			this.showDetail()
		} else {
			this.hideDetail()
		}
	}

	render() {
		let nickname = this.props.babyDetail.nickname
		let tag = this.props.babyDetail.tag
		let year = this.props.babyDetail.year
		let color= this.props.color

		var detailClasses = classNames({
			'baby-detail': true,
			'blue': this.isBlue(color),
			'orange': this.isOrange(color),
			'yellow': this.isYellow(color),
			'green': this.isGreen(color),
		})

		return (
			<div 
				ref="detail"
				className={detailClasses}>

				<div className="nickname">{nickname}</div>
				<div className="skill">{tag}</div>
				<div className="promotion">Promotion {year}</div>
			</div>
		);
	}

}
