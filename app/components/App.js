import React from "react"

import Form from "./form/Form.js"
import Board from "./babiesboard/Board"
import Footer from "./GUI/Footer.js"
import FilterNav from "./GUI/FilterNav.js"

export default class App extends React.Component {
    constructor(){
        super()

        this.state = {
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            formDisplayed: false,
            spacePressed: false,
        }
    }

    componentDidMount(){
        window.addEventListener('resize', this.handleResize.bind(this))
    }

    setIsDisplayedState(value) {
        this.setState({
            formDisplayed: value
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
            <div className="main-content">
                <Form
                    isDisplayed={this.state.formDisplayed}
                    setFormIsDisplayedProps={this.setIsDisplayedState.bind(this)}/>
                <Board
                    viewportSize={this.state.viewportSize}
                    formDisplayed={this.state.formDisplayed}
                    setFormIsDisplayedProps={this.setIsDisplayedState.bind(this)}/>
                <FilterNav />
                <Footer />
            </div>
        )
    }
}
