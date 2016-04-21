import React from "react"

import Board from "./babiesboard/Board"

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
            <Board viewportSize={this.state.viewportSize} />
        )
    }
}
