import React from "react"
import qwest from "qwest"
import GSAP from 'gsap'

import BabiesList from "./BabiesList"

export default class Board extends React.Component {
    constructor(){
        super()

        this.state = {
            babies: [],
            babiesData: {},
            boardWidth: 3000,
            boardHeight: 1666,
            boardTranslateX: {
                X: 0,
                min: null,
                max: null
            },
            boardTranslateY: {
                Y: 0,
                min: null,
                max: null
            },
        }
    }

    loadBabies(){
        qwest
            .get("/json/babies.json")
            .then((xhr, response) => {
                this.setState({
                    babies: response.babies,
                    babiesData: response.babies[0]
                })
            })
    }

    componentWillMount(){
        // Add event listener
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
        
        // Set board DOM Elem
        this.setState({
            viewportSize: this.props.viewportSize
        })
    }

    componentDidMount(){
        // Load babies JSON
        this.loadBabies()

        // Center board & set min/max board translateX/Y
        let centerX = -((this.state.boardWidth/2) - (this.props.viewportSize.width/2));
        let centerY = -((this.state.boardHeight/2) - (this.props.viewportSize.height/2));

        // Set states
        this.setState({
            initialBoardTransform: 'translate3d('+ centerX +'px,'+ centerY +'px,0)',
            boardTranslateX: {
                X: centerX,
                max: 0,
                min: - (this.state.boardWidth - this.props.viewportSize.width)
            },
            boardTranslateY: {
                Y: centerY,
                max: 0,
                min: - (this.state.boardHeight - this.props.viewportSize.height)
            },
            mouseMoveAreaSize: 200
        })
    }

    componentWillUnmount(){
        window.removeEventListener("keydown", this.handleKeyDown.bind(this))
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

    handleMouseMove(e){
        e.preventDefault()
        var direction = null
        var isPositive = null

        // Clear navigate interval
        clearInterval(this.state.navigateInterval)

        // Mouse is in top area
        if((e.clientY > 0) && (e.clientY < this.state.mouseMoveAreaSize)) {
            direction = "Y"
            isPositive = true
        }
        // Mouse is in bottom area
        else if((e.clientY > this.state.viewportSize.height - this.state.mouseMoveAreaSize) && (e.clientY < this.state.viewportSize.height)) {
            direction = "Y"
            isPositive = false
        }
        // Mouse is in left area
        else if((e.clientX > 0) && (e.clientX < this.state.mouseMoveAreaSize)) {
            direction = "X"
            isPositive = true
        }
        // Mouse is in right area
        else if((e.clientX > this.state.viewportSize.width - this.state.mouseMoveAreaSize) && (e.clientX < this.state.viewportSize.width)) {
            direction = "X"
            isPositive = false
        }

        // Execute navigate
        if (direction != null && isPositive != null) {
            this.navigate(direction, isPositive)
            var navigateInterval = setInterval(this.navigate.bind(this, direction, isPositive), 50)
            this.setState({
                navigateInterval: navigateInterval
            })
        }
    }

    navigate(direction, isPositive){
        let { X } = this.state.boardTranslateX
        let { Y } = this.state.boardTranslateY

        switch(direction){
            // Case translate Y
            case "Y":
                if (isPositive) {
                    Y = Y + 20
                } else {
                    Y = Y - 20
                }
                break;
            // Case translate X
            case "X":
                if (isPositive) {
                    X = X + 20
                } else {
                    X = X - 20
                }
                break;
        }

        // Check if X is in range
        if (X < this.state.boardTranslateX.min) {
            X = this.state.boardTranslateX.min
        } else if (X > this.state.boardTranslateX.max){
            X = this.state.boardTranslateX.max
        }
        // Check if Y is in range
        if (Y < this.state.boardTranslateY.min) {
            Y = this.state.boardTranslateY.min
        } else if (Y > this.state.boardTranslateY.max){
            Y = this.state.boardTranslateX.max
        }

        this.setState({
            boardTranslateX: {
                X: X,
                max: 0,
                min: - (this.state.boardWidth - this.props.viewportSize.width)
            },
            boardTranslateY: {
                Y: Y,
                max: 0,
                min: - (this.state.boardHeight - this.props.viewportSize.height)
            }
        })

        this.updateBoardTransform()
    }

    updateBoardTransform(){
        TweenMax.to(this.refs.board,1, {
            x: this.state.boardTranslateX.X,
            y: this.state.boardTranslateY.Y,
            ease: Power2.easeOut
        })
    }

    render(){
        let style = {
            width: this.state.boardWidth,
            height: this.state.boardHeight,
            transform: this.state.initialBoardTransform
        }

        return (
            <section
                ref="board"
                className="babies-board"
                style={style}
                onKeyDown={this.handleKeyDown.bind(this)}
                onMouseMove={this.handleMouseMove.bind(this)}
                >
                <BabiesList {...this.state} />
            </section>
        )
    }
}
