import React from 'react'

export default class Controls extends React.Component {
    constructor() {
        super()
    }

    render() {
        var top = "arrow-top"
        var left = "arrow-left"
        var bottom = "arrow-bottom"
        var right = "arrow-right"

        if (this.props.controlsHighlighting.top) {
            top = "arrow-top active"
        } else if (this.props.controlsHighlighting.left) {
            left = "arrow-left active"
        } else if (this.props.controlsHighlighting.bottom) {
            bottom = "arrow-bottom active"
        } else if (this.props.controlsHighlighting.right) {
            right = "arrow-right active"
        }

        return(
            <nav className="controls">
                <div className="controls--arrows">
                    <span className={top}></span>
                    <span className={left}></span>
                    <span className={bottom}></span>
                    <span className={right}></span>
                </div>
            </nav>
        );
    }
}
