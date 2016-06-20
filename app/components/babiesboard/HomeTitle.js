import React from 'react'

import SpaceBar from './Spacebar'

export default class HomeTitle extends React.Component {
	constructor() {
		super()

		this.state = {
			width: 450,
			height: 250
		}

	}

	componentDidMount() {
		var titleElem = this.refs.homeTitle.width
		console.log(titleElem)
	}

	render() {
		var titleStyle = {
			position: 'absolute',
			top: (this.props.boardHeight / 2) - (this.state.height / 2),
			left: (this.props.boardWidth / 2) - (this.state.width / 2),
			zIndex: 100,
		}

		return(
			<div 
			className="title-container"
			style={titleStyle}
			ref="homeTitle">
				<h1><span>Aujourd'hui, synerg'hetic compte 164 enfants du web !</span></h1>

				<SpaceBar
					formDisplayed={this.props.formDisplayed}
					setFormIsDisplayedProps={this.props.setFormIsDisplayedProps} />
				<p>Maintenez la barre espace pour ...</p>
			</div>
		)

	}
}
