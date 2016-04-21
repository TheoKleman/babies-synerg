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
            style: {
                transform: 'translate3d(0,0,0)'
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
        })
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
        console.log(direction, isPositive)
        const { X } = this.state.boardTranslateX
        const { Y } = this.state.boardTranslateY

        switch(direction){
            // Case translate Y
            case "Y":
                if (isPositive) {
                    this.setState({
                        style: {
                            transform: 'translate3d('+X+'px,'+Y+'px,0)'
                        },
                        boardTranslateY: {
                            Y: Y + 20
                        }
                    })
                } else {
                    this.setState({
                        style: {
                            transform: 'translate3d('+X+'px,'+Y+'px,0)'
                        },
                        boardTranslateY: {
                            Y: Y - 20
                        }
                    })
                }
                break;
            // Case translate X
            case "X":
                if (isPositive) {
                    this.setState({
                        style: {
                            transform: 'translate3d('+X+'px,'+Y+'px,0)'
                        },
                        boardTranslateX: {
                            X: X + 20
                        }
                    })
                } else {
                    this.setState({
                        style: {
                            transform: 'translate3d('+X+'px,'+Y+'px,0)'
                        },
                        boardTranslateX: {
                            X: X - 20
                        }
                    })
                }
                break;
        }
    }

    render(){
        
        return (
            <section className="babies-board" style={this.state.style}>
                <BabiesList {...this.state} />
            </section>
        )
    }
}
