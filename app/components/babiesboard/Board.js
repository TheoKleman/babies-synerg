import React from "react"

export default class Board extends React.Component {
    constructor(){
        super()

        this.state = {
            boardElem: null
        }
    }

    componentWillMount(){
        const boardElem = document.getElementsByClassName('babies-board');

        this.setState({
            boardElem: boardElem
        })
    }

    componentDidMount(){
        this.state.boardElem.on('keypress', this.navigate);
    }

    navigate(e){
        console.log(e)
    }

    render(){
        return (
            <section className="babies-board">

            </section>
        )
    }
}
