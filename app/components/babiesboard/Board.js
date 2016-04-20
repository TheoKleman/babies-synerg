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

        // Set board DOM Elem
        this.setState({
            boardElem: boardElem,
            style: {
                transform: 'translate3d(0,0,0)'
            },
            boardTranslateY: 0,
            boardTranslateX: 0
        })
    }

    componentDidMount(){
        // Add event listener
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
    }

    handleKeyDown(e){
        e.preventDefault()

        // Arrow up
        if(e.keyCode == 38) {
            this.navigate("Y",true)
        }
        // Arrow down
        if(e.keyCode == 40) {
            this.navigate("Y",false)
        }
        // Arrow left
        if(e.keyCode == 37) {
            this.navigate("X",true)
        }
        // Arrow right
        if(e.keyCode == 39) {
            this.navigate("X",false)
        }
    }

    navigate(direction, isPositive){
        console.log(direction, isPositive)
        const { boardTranslateY, boardTranslateX } = this.state

        switch(direction){
            // Case translate Y
            case "Y":
                if (isPositive) {
                    this.setState({
                        style: {
                            transform: 'translate3d('+boardTranslateX+'px,'+boardTranslateY+'px,0)'
                        },
                        boardTranslateY: boardTranslateY + 20
                    })
                } else {
                    this.setState({
                        style: {
                            transform: 'translate3d('+boardTranslateX+'px,'+boardTranslateY+'px,0)'
                        },
                        boardTranslateY: boardTranslateY - 20
                    })
                }
                break;
            // Case translate X
            case "X":
                if (isPositive) {
                    this.setState({
                        style: {
                            transform: 'translate3d('+boardTranslateX+'px,'+boardTranslateY+'px,0)'
                        },
                        boardTranslateX: boardTranslateX + 20
                    })
                } else {
                    this.setState({
                        style: {
                            transform: 'translate3d('+boardTranslateX+'px,'+boardTranslateY+'px,0)'
                        },
                        boardTranslateX: boardTranslateX - 20
                    })
                }
                break;
        }
    }

    render(){
        return (
            <section className="babies-board" style={this.state.style}>

            </section>
        )
    }
}
