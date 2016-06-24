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
            mouseDownPos: {
                X: 0,
                Y: 0,
            },
            mouseDown: false,
            mouseDownInitialX: 0,
            mouseDownInitialY: 0,
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
            detailDisplayed: false,
            isSorting: false,
        }
    }

    componentDidMount(){
        window.addEventListener('resize', this.handleResize.bind(this))
        // window.addEventListener('mousemove', this.handleMouseDownMove.bind(this))
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

    handleMouseDown(e) {
        let initialX = e.pageX
        let initialY = e.pageY
        this.setState({
            mouseDown: true,
            mouseDownInitialX: initialX,
            mouseDownInitialY: initialY
        })
    }

    handleMouseUp(e) {
        this.setState({
            mouseDown: false
        })
    }

    handleMouseDownMove(e) {
        if (this.state.mouseDown) {
            this.setState({
                mouseDownPos: {
                    X: e.pageX - this.state.mouseDownInitialX,
                    Y: e.pageY - this.state.mouseDownInitialY
                }
            })
        } else {
            this.setState({
                mouseDownPos: {
                    X: 0,
                    Y: 0
                }
            })
        }
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

    setSorting(value) {
        this.setState({
            isSorting: value
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
            <div
                className="main-content"
                onWheel={this.handleScroll.bind(this)}
                onMouseDown={this.handleMouseDown.bind(this)}
                onMouseUp={this.handleMouseUp.bind(this)}
                >
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
                    setSorting={this.setSorting.bind(this)}
                    isSorting={this.state.isSorting}
                    controlsHighlighting={this.state.controlsHighlighting}
                    setControlHighlighting={this.setControlHighlighting.bind(this)}
                    unsetControlsHighlighting={this.unsetControlsHighlighting.bind(this)}
                    isDragging={this.state.mouseDown}
                    mouseDownDrag={this.state.mouseDownPos} />
                <DetailBaby
                    isDisplayed={this.state.detailDisplayed}
                    babyDetail={this.state.babyHoveredDetail} />
                <FilterNav
                    isSorting={this.state.isSorting}
                    setSorting={this.setSorting.bind(this)} />
                <Footer />
                <Controls 
                    controlsHighlighting={this.state.controlsHighlighting} />
            </div>
        )
    }
}
