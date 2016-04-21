import React from "react"
import qwest from "qwest"

import BabiesList from "./BabiesList"

export default class Board extends React.Component {
    constructor(){
        super()

        this.state = {
            boardElem: null,
            babies: [],
            babiesData: {},
            boardWidth: 3000,
            boardHeight: 1666
        }
    }

    loadBabies() {
        qwest
            .get("./../json/babies.json")
            .then((xhr, response) => {
                this.setState({
                    babies: response.babies,
                    babiesData: response.babies[0]
                })
            })
    }

    componentWillMount(){
        const boardElem = document.getElementsByClassName('babies-board');

        // Set board DOM Elem
        this.setState({
            boardElem: boardElem,
            boardTransform: 'translate3d(0px,0px,0)',
            style: {
                transform: 'translate3d(0px,0px,0)',
                width: "3000px",
                height: "1666px",
            },
            boardTranslateY: {
                Y: 0,
                min: null,
                max: null
            },
            boardTranslateX: {
                X: 0,
                min: null,
                max: null
            }
        });
    }

    componentDidMount(){
        // Add event listener
        window.addEventListener('keydown', this.handleKeyDown.bind(this))

        this.loadBabies()
    }

    handleKeyDown(e){
        // Arrow up
        if(e.keyCode == 38) {
            e.preventDefault()
            this.navigate("Y",true)
        }
        // Arrow down
        if(e.keyCode == 40) {
            e.preventDefault()
            this.navigate("Y",false)
        }
        // Arrow left
        if(e.keyCode == 37) {
            e.preventDefault()
            this.navigate("X",true)
        }
        // Arrow right
        if(e.keyCode == 39) {
            e.preventDefault()
            this.navigate("X",false)
        }
    }

    navigate(direction, isPositive){
        let { X } = this.state.boardTranslateX
        let { Y } = this.state.boardTranslateY

        switch(direction){
            // Case translate Y
            case "Y":
                if (isPositive) {
                    this.setState({
                        boardTranslateY: {
                            Y: Y + 20
                        }
                    })
                    this.setState({
                        boardTransform: 'translate3d('+this.state.boardTranslateX.X+'px,'+this.state.boardTranslateY.Y+'px,0)'
                    })
                    this.updateTransform()
                } else {
                    this.setState({
                        boardTranslateY: {
                            Y: Y - 20
                        }
                    })
                    this.setState({
                        boardTransform: 'translate3d('+this.state.boardTranslateX.X+'px,'+this.state.boardTranslateY.Y+'px,0)'
                    })
                    this.updateTransform()
                }
                break;
            // Case translate X
            case "X":
                if (isPositive) {
                    this.setState({
                        boardTranslateX: {
                            X: X + 20
                        }
                    })
                    this.setState({
                        boardTransform: 'translate3d('+this.state.boardTranslateX.X+'px,'+this.state.boardTranslateY.Y+'px,0)'
                    })
                    this.updateTransform()
                } else {
                    this.setState({
                        boardTranslateX: {
                            X: X - 20
                        }
                    })
                    this.setState({
                        boardTransform: 'translate3d('+this.state.boardTranslateX.X+'px,'+this.state.boardTranslateY.Y+'px,0)'
                    })
                    this.updateTransform()
                }
                break;
        }
    }

    updateTransform(){
        let { style } = this.state;
        style.transform = this.state.boardTransform

        this.setState({
            style: style
        })
    }

    render(){
        
        return (
            <section className="babies-board" style={this.state.style}>
                <BabiesList {...this.state} />
            </section>
        )
    }
}
