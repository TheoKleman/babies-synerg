import React from "react"

export default class App extends React.Component {
    constructor(){
        super()

        this.state = {
            body: "Hello world !"
        }
    }

    render(){
        return (
            <main>
                <h1>{this.state.body}</h1>
            </main>
        )
    }
}
