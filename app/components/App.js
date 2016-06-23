import React from "react"

import Form from "./form/Form.js"
import Board from "./babiesboard/Board"
import Footer from "./GUI/Footer.js"
import FilterNav from "./GUI/FilterNav.js"
import Controls from "./GUI/Controls.js"
import DetailBaby from "./babiesBoard/DetailBaby"

export default class App extends React.Component {
    constructor(){
        super()

        this.state = {
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            formDisplayed: false,
            controlsHighlighting: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            },
            scrollDelta: {
                deltaX: 0,
                deltaY: 0
            },
            boardWidth: 4400,
            boardHeight: 2475,
            mouseInViewport: true,
            detailDisplayed: false,
            babyHoveredDetail: {
                nickname: "",
                skills: [],
                tag: "",
                year: 0
            },
            detailDisplayed: false
        }
    }

    componentDidMount(){
        window.addEventListener('resize', this.handleResize.bind(this))
        // window.addEventListener('onmouseweel', this.handleScroll.bind(this));
    }

    componentWillUnmount() {
        // window.removeEventListener('onmouseweel', this.handleScroll.bind(this));
    }

    handleScroll(e) {
        e.preventDefault()
        this.setState({
            scrollDelta: {
                deltaX: e.deltaX,
                deltaY: e.deltaY
            }
        })
    }

    setControlHighlighting(control) {
        var self = this;
        var top = false
        var right = false
        var left = false
        var bottom = false

        switch (control) {
            case "top":
                top = true
                break
            case "right":
                right = true
                break
            case "bottom":
                bottom = true
                break
            case "left":
                left = true
                break
        }

        this.setState({
            controlsHighlighting: {
                top: top,
                right: right,
                bottom: bottom,
                left: left,
            }
        })
    }
    
    unsetControlsHighlighting() {
        this.setState({
            controlsHighlighting: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            }
        })
    }

    setFormIsDisplayedState(value) {
        this.setState({
            formDisplayed: value
        })
    }

    setDetailIsDisplayedState(value) {
        this.setState({
            detailDisplayed: value
        })
    }

    setBabyDetail(value) {
        this.setState({
            babyHoveredDetail: value
        })
    }

    handleResize(){
        this.setState({
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        })
    }

    render(){
        return (
            <div className="main-content" onWheel={this.handleScroll.bind(this)}>
                <Form
                    isDisplayed={this.state.formDisplayed}
                    setFormIsDisplayedProps={this.setFormIsDisplayedState.bind(this)} />
                <Board
                    viewportSize={this.state.viewportSize}
                    scrollDelta={this.state.scrollDelta}
                    formDisplayed={this.state.formDisplayed}
                    setFormIsDisplayedProps={this.setFormIsDisplayedState.bind(this)}
                    setDetailIsDisplayedProps={this.setDetailIsDisplayedState.bind(this)}
                    setBabyDetail={this.setBabyDetail.bind(this)}
                    controlsHighlighting={this.state.controlsHighlighting}
                    setControlHighlighting={this.setControlHighlighting.bind(this)}
                    unsetControlsHighlighting={this.unsetControlsHighlighting.bind(this)} />
                <DetailBaby
                    isDisplayed={this.state.detailDisplayed}
                    babyDetail={this.state.babyHoveredDetail} />
                <FilterNav />
                <Footer />
                <Controls 
                    controlsHighlighting={this.state.controlsHighlighting} />
            </div>
        )
    }
}
