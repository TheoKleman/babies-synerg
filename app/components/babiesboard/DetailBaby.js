import React, { Component, PropTypes } from "react"
import GSAP from 'gsap'

export default class DetailBaby extends Component {
	constructor() {
		super()

	}

	componentWillUpdate(nextProps) {
		if(nextProps.isDisplayed == true) {
			this.showDetail()
		} else {
			this.hideDetail()
		}
	}

	showDetail() {
		if(!this.props.isDisplayed) {
			var self = this

			TweenMax.to(this.refs.detail, .5, {
				opacity: 1,
				x: -100,
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
			x: 100,
			ease: Power2.easeOut,
			onComplete: function() {
				self.refs.detail.className = 'baby-detail';
			}
		})
	}

	render() {

		return (
			<div 
				ref="detail"
				className="baby-detail">

				<div className="nickname">Jean michel</div>
				<div className="skill">Fond de bus</div>
				<div className="promotion">Promotion 2018</div>
			</div>
		);
	}

}
