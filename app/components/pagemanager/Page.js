import React from "react"
import ReactDOM from "react-dom"
import GSAP from "gsap"

import About from './pages/About.js'
import Credits from './pages/Credits.js'

import CloseButton from './pagesControls/CloseButton.js'

export default class Page extends React.Component {
	constructor() {
		super()
	}

	componentWillMount() {
		window.addEventListener('keydown', this.handleKeyDown.bind(this))
	}
	
	componentDidMount() {
		TweenMax.to(this.refs.itSelf, .5, {
			opacity: 1,
			scale: 1,
			ease: Power2.easeInOut,
		})

		this.props.setPageIsOpened(true)
	}

	componentWillUnmount() {
		TweenMax.to(this.refs.itSelf, .5, {
			opacity: 0,
			scale: .95,
			ease: Power2.easeInOut,
		})

		window.removeEventListener('keydown', this.handleKeyDown.bind(this))
	}

	unmountComponent() {	
		this.props.setPageIsOpened(false)
	}

	handleKeyDown(e) {
		// ESC key
		if (e.keyCode == 27 && this.props.setPageIsOpened) {
			this.props.setPageIsOpened(false)
		}
	}

	render() {

		var pageToShow
		switch(this.props.pageSlug) {
			case 'about': 
				pageToShow = <About />
				break;
			case 'credits': 
				pageToShow = <Credits />
				break;
		}

		return(
			<div 
				className="page"
				ref="itSelf">
				{pageToShow}
				<CloseButton close={this.unmountComponent.bind(this)} />
			</div>
		)
	}
}
