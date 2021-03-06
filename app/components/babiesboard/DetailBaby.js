import React, { Component, PropTypes } from "react"
import GSAP from 'gsap'

var classNames = require('classnames')

export default class DetailBaby extends Component {
	constructor() {
		super()

		this.translationX = 30
		this.translateOrigin = 0
	}

	componentWillUpdate(nextProps) {

	}

	showDetail() {
		if(!this.props.isDisplayed) {
			var self = this

			TweenMax.to(this.refs.detail, 0, {
				opacity: 1,
				x: self.translationX,
				scale: 1,
				ease: Power2.easeOut,
				onStart: function(){
                    self.refs.detail.className += ' displayed';
                }
			})
		}
	}

	hideDetail() {
		var self = this

		TweenMax.to(this.refs.detail, .1, {
			opacity: 0,
			x: self.translateOrigin,
			scale: 0.9,
			ease: Power2.easeOut,
			onComplete: function() {
				self.refs.detail.className = 'baby-detail';
			}
		})
	}

	componentDidUpdate() {
		if(!this.props.isMooving) {
			if(this.props.isDisplayedBabyDetail) {
				this.showDetail()
			} else {
				this.hideDetail()
			}
		}
	}

	render() {
		let nickname = this.props.babyDetail.nickname
		let tag = this.props.babyDetail.tag
		let year = this.props.babyDetail.year

		var detailClasses = classNames({
			'baby-detail': true
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
