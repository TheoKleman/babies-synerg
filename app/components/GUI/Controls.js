import React from 'react'

var classNames = require('classnames')

export default class Controls extends React.Component {
    constructor() {
        super()
    }

    muteSound(value) {
        if(this.props.isSoundActive) {
            this.props.setSound(false)
        } else {
            this.props.setSound(true)
        }
    }

    render() {
        var top = "arrow-top key mini"
        var left = "arrow-left key mini"
        var bottom = "arrow-bottom key mini"
        var right = "arrow-right key mini"

        if (this.props.controlsHighlighting.top) {
            top = "arrow-top key mini active"
        } else if (this.props.controlsHighlighting.left) {
            left = "arrow-left key mini active"
        } else if (this.props.controlsHighlighting.bottom) {
            bottom = "arrow-bottom key mini active"
        } else if (this.props.controlsHighlighting.right) {
            right = "arrow-right key mini active"
        }

        var soundClasses = classNames({
            'controls--sound': true,
            'active': !this.props.isSoundActive
        })

        var controlsClasses = classNames({
            'controls--arrows': true,
            'hidden': this.props.formDisplayed
        })

        return(
            <nav className="controls">
                <div className={controlsClasses}>
                    <button className={top}>
                        <span className="key--content">
                            <img src="/images/UI/left-arrow.svg" alt=""/>
                        </span>
                        <span className="key--double"></span>
                    </button>
                    <button className={left}>
                        <span className="key--content">
                            <img src="/images/UI/left-arrow.svg" alt=""/>
                        </span>
                        <span className="key--double"></span>
                    </button>
                    <button className={bottom}>
                        <span className="key--content">
                            <img src="/images/UI/left-arrow.svg" alt=""/>
                        </span>
                        <span className="key--double"></span>
                    </button>
                    <button className={right}>
                        <span className="key--content">
                            <img src="/images/UI/left-arrow.svg" alt=""/>
                        </span>
                        <span className="key--double"></span>
                    </button>
                </div>
                <div 
                    className={soundClasses}
                    onClick={this.muteSound.bind(this)}>
                    <img src="/images/UI/sound.svg" alt=""/>
                </div>
            </nav>
        );
    }
}
