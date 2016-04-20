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
        // this.state.boardElem.on('keypress', this.navigate);
        window.addEventListener('keydown', this.handleKeyDown)
    }

    navigate(e){
        console.log(e)
    }

    handleKeyDown(e) {
        e.preventDefault()

        if(e.keyCode == 38) {
            console.log('en haut')
        }
        if(.keyCode == 40) {
            console.log('en bas')
        }
        if(e.keyCode == 37) {
            console.log('a gauche')
        }
        if(.keyCode == 39) {
            console.log('a droite')
            console.log('ces soirées là')
        }
    }

    render(){
        return (
            <section className="babies-board">

            </section>
        )
    }
}
