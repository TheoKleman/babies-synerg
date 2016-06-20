import React from 'react'
var classNames = require('classnames')

export default class SpaceBar extends React.Component {
    constructor() {
        super()

        this.state = {
            clickDown: false,
            clickTO: null,
            p: 0
        }
    }

    handleMouseDown(e) {
        var self = this

        if (!this.props.formDisplayed && !this.state.clickDown) {
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
                clickProgress: setInterval(function(){
                    self.setState({
                        p: self.state.p + 1
                    })
                }, 10)
            })
        }
    }

    handleMouseUp(e) {
        // Reset timeout & Reset progression
        clearTimeout(this.state.clickTO)
        clearInterval(this.state.clickProgress)
        this.setState({
            clickDown: false,
            p: 0
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
                    className={spaceClasses}>Un projet digital à leur confier ? ({this.state.p}%)</button>
            </div>
        )
    }

}
