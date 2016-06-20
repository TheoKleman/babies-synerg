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

    handleMouseDown(e) {
        var self = this

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

    handleMouseUp(e) {
        clearTimeout(this.state.clickTO)
        this.setState({
            clickDown: false,
        })
    }

    render() {
        var spaceClasses = classNames({
            'space-bar': true
        })

        return(
            <div 
                className="space-bar-wrapper"
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
                >
                <span className="space-bar-double"></span>
                <button
                    className={spaceClasses}>Un projet digital à leur confier ?</button>
            </div>
        )
    }

}
