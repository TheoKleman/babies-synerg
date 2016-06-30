import React from 'react'

import SpaceBar from './Spacebar'

var classNames = require('classnames')

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
			className="title-container disable-select"
			style={titleStyle}
			ref="homeTitle">
				<h1><span>Aujourd'hui, synerg'hetic compte 164 <br />enfants du web !</span></h1>

				<SpaceBar
					formDisplayed={this.props.formDisplayed}
					setFormIsDisplayedProps={this.props.setFormIsDisplayedProps}
					spacebarDown={this.props.spacebarDown}
					centerBoard={this.props.centerBoard}
					isSoundActive={this.props.isSoundActive} />
				<p>Maintenez la barre espace pour nous le présenter</p>
			</div>
		)

	}
}
