import React from 'react'
var classNames = require('classnames')

export default class SpaceBar extends React.Component {
    constructor() {
        super()

        this.state = {
            clickDown: false,
            clickTO: null,
        }
    }

    handleMouseDown(e) {
        var self = this

        if (!this.props.formDisplayed && !this.state.clickDown) {
            // Center board
            this.props.centerBoard()
            this.setState({
                clickDown: true,
                clickTO: setTimeout(function(){
                    clearInterval(self.state.clickProgress)
                    self.props.setFormIsDisplayedProps(true)
                    self.setState({
                        clickDown: false,
                        p: 0,
                    })
                }, 1000),
            })
        }
    }

    handleMouseUp(e) {
        // Reset timeout & Reset progression
        clearTimeout(this.state.clickTO)
        clearInterval(this.state.clickProgress)
        this.setState({
            clickDown: false,
        })
    }

    render() {
        var spaceClasses = classNames({
            'space-bar': true
        })

        return(
            <button
                className="key spacebar"
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
                >
                <span className="key--content">Un projet digital à leur confier ?</span>
                <span className="key--double"></span>
            </button>
        )
    }

}
