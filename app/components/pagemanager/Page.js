import React from 'react'
import GSAP from 'gsap'

export default class Page extends React.component {
	constructor() {
		super()
	}

	componentDidMount() {
		TweenMax.to(this.refs.itSelf, .5, {
			opacity: 1,
			scale: 1,
			ease: Power2.easeInOut,
		})
	}

	componentWillUnmount() {
		TweenMax.to(this.refs.itSelf, .5, {
			opacity: 0,
			scale: .95,
			ease: Power2.easeInOut,
		})	
	}

	unmountComponent() {
		this.unmountComponentAtNode(this.refs.itSelf);
	}
}
