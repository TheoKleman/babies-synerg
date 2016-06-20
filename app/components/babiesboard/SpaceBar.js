import React from 'react'
var classNames = require('classnames')

export default class SpaceBar extends React.Component {
	constructor() {
		super()

		this.state = {
			clickDown: false,
			clickTO: null
		}
	}

	handleClick() {
		var self = this;

		if (!this.props.formDisplayed && !this.state.clickDown) {
            this.setState({
                clickDown: true,
                clickTO: setTimeout(function(){
                    self.props.setFormIsDisplayedProps(true)
                    self.setState({
                        clickDown: false,
                    })
                }, 1000)
            })
        }
	}

	render() {
		var spaceClasses = classNames({
			'space-bar': true
		})

		return(
			<div 
				className="space-bar-wrapper"
				onClick={this.handleClick.bind(this)}
				>
				<span className="space-bar-double"></span>
				<button
					className={spaceClasses}>Un projet digital à leur confier ?</button>
			</div>
		)
	}

}
