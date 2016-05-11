import React from "react"

import Board from "./babiesboard/Board"
import HomeInterface from "./GUI/HomeInterface.js"

export default class App extends React.Component {
    constructor(){
        super()

        this.state = {
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        }
    }

    handleResize(){
        this.setState({
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        })
    }

    componentDidMount(){
        window.addEventListener('resize', this.handleResize.bind(this))
    }

    render(){
        return (
            <div className="main-content">
                <HomeInterface />
                <Board viewportSize={this.state.viewportSize} />
            </div>
        )
    }
}
