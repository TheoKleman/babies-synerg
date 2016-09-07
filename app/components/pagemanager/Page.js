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
		console.log('yeah clicked');
		ReactDOM.unmountComponentAtNode(this.refs.itSelf);
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
