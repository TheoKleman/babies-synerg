import React from "react"

import Board from "./babiesboard/Board"

export default class App extends React.Component {
    constructor(){
        super()
    }

    render(){
        return (
            <Board />
        )
    }
}
