import React from "react"   
import qwest from "qwest"
import GSAP from 'gsap'

import BabiesList from "./BabiesList"
import HomeTitle from "./HomeTitle"

export default class Board extends React.Component {
    constructor() {
        super()

        // w 4400
        // h 2475
        this.state = {
            boardWidth: 3400,
            boardHeight: 1900,
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
            spacebarDown: false,
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // You can access `this.props` and `this.state` here
        // This function should return a boolean, whether the component should re-render.
        return false;
    }

    componentWillMount() {
        // Add event listener
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
        window.addEventListener('keypress', this.handleKeyPress.bind(this))
        window.addEventListener("keyup", this.handleKeyUp.bind(this))
        
        // Set board DOM Elem
        this.setState({
            viewportSize: this.props.viewportSize
        })
    }

    componentDidMount() {
        // Center board & set min/max board translateX/Y
        let centerX = -((this.state.boardWidth/2) - (this.props.viewportSize.width/2));
        let centerY = -((this.state.boardHeight/2) - (this.props.viewportSize.height/2));

        // Set states
        this.setState({
            boardCenterX: centerX,
            boardCenterY: centerY,
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
            mouseMoveAreaSize: 170
        })
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this))
        window.removeEventListener("keypress", this.handleKeyPress.bind(this))
        window.removeEventListener("keyup", this.handleKeyUp.bind(this))
    }

    handleKeyDown(e) {
        // Handle arrow keys only if board is movable
        if (!this.props.formDisplayed) {
            var direction = null
            var isPositive = null

            // Clear mouse navigate interval
            if (this.state.boardIsTranslatingWithMouse) {
                clearInterval(this.state.navigateInterval)
                this.setState({
                    boardIsTranslatingWithMouse: false,
                    navigateInterval: undefined,
                    mouseOnTopArea: false,
                    mouseOnBottomArea: false,
                    mouseOnLeftArea: false,
                    mouseOnRightArea: false,
                })
            }

            // Arrow up
            if (e.keyCode == 38) {
                e.preventDefault()
                direction = "Y"
                isPositive = true
                this.props.setControlHighlighting("top", true)
            }
            // Arrow down
            else if (e.keyCode == 40) {
                e.preventDefault()
                direction = "Y"
                isPositive = false
                this.props.setControlHighlighting("bottom", true)
            }
            // Arrow left
            else if (e.keyCode == 37) {
                e.preventDefault()
                direction = "X"
                isPositive = true
                this.props.setControlHighlighting("left", true)
            }
            // Arrow right
            else if (e.keyCode == 39) {
                e.preventDefault()
                direction = "X"
                isPositive = false
                this.props.setControlHighlighting("right", true)
            }

            // Execute navigate
            if (direction != null && isPositive != null && !this.state.boardIsTranslatingWithKeys) {
                this.navigate(direction, isPositive)
                var navigateInterval = setInterval(this.navigate.bind(this, direction, isPositive), 25)
                this.setState({
                    boardIsTranslatingWithKeys: true,
                    navigateInterval: navigateInterval
                })
            }
        }
    }

    handleKeyPress(e) {
        var self = this;

        // Spacebar - Open form modal
        if (e.keyCode == 32 && !this.props.formDisplayed && !this.state.spacebarDown) {
            // Center board 
            self.centerBoard()

            self.setState({
                spacebarDown: true,
                spacebarTO: setTimeout(function(){
                    self.props.setFormIsDisplayedProps(true)
                    self.setState({
                        spacebarDown: false,
                    })
                }, 1000)
            })

            console.log(self.state.spacebarDown)
        }
    }

    handleKeyUp(e) {
        // Clear navigate interval
        clearInterval(this.state.navigateInterval)
        this.setState({
            boardIsTranslatingWithKeys: false,
        })

        if (e.keyCode == 32 && !this.props.formDisplayed) {
            clearTimeout(this.state.spacebarTO)
            this.setState({
                spacebarDown: false,
            })
        }

        // Unset controls highlithing
        if(e.keyCode == 38 || e.keyCode == 40 || e.keyCode == 37 || e.keyCode == 39) {
            this.props.unsetControlsHighlighting()   
        }
    }

    handleMouseMove(e) {
        e.preventDefault()

        // Handle Mouse Move only if board is movable
        if (!this.props.formDisplayed) {
            var direction = null
            var isPositive = null

            // Mouse is in top area
            if((e.clientY > 0) && (e.clientY < this.state.mouseMoveAreaSize)) {
                if (!this.state.mouseOnTopArea) {
                    clearInterval(this.state.navigateInterval)
                    this.setState({
                        navigateInterval: undefined
                    })
                }
                this.setState({
                    mouseOnTopArea: true,
                    mouseOnBottomArea: false,
                    mouseOnLeftArea: false,
                    mouseOnRightArea: false,
                })
                direction = "Y"
                isPositive = true
            }
            // Mouse is in bottom area
            else if((e.clientY > this.state.viewportSize.height - this.state.mouseMoveAreaSize) && (e.clientY < this.state.viewportSize.height)) {
                if (!this.state.mouseOnBottomArea) {
                    clearInterval(this.state.navigateInterval)
                    this.setState({
                        navigateInterval: undefined
                    })
                }
                this.setState({
                    mouseOnTopArea: false,
                    mouseOnBottomArea: true,
                    mouseOnLeftArea: false,
                    mouseOnRightArea: false,
                })
                direction = "Y"
                isPositive = false
            }
            // Mouse is in left area
            else if((e.clientX > 0) && (e.clientX < this.state.mouseMoveAreaSize)) {
                if (!this.state.mouseOnLeftArea) {
                    clearInterval(this.state.navigateInterval)
                    this.setState({
                        navigateInterval: undefined
                    })
                }
                this.setState({
                    mouseOnTopArea: false,
                    mouseOnBottomArea: false,
                    mouseOnLeftArea: true,
                    mouseOnRightArea: false,
                })
                direction = "X"
                isPositive = true
            }
            // Mouse is in right area
            else if((e.clientX > this.state.viewportSize.width - this.state.mouseMoveAreaSize) && (e.clientX < this.state.viewportSize.width)) {
                if (!this.state.mouseOnRightArea) {
                    clearInterval(this.state.navigateInterval)
                    this.setState({
                        navigateInterval: undefined
                    })
                }
                this.setState({
                    mouseOnTopArea: false,
                    mouseOnBottomArea: false,
                    mouseOnLeftArea: false,
                    mouseOnRightArea: true,
                })
                direction = "X"
                isPositive = false
            } 
            // Other case
            else {
                clearInterval(this.state.navigateInterval)
                this.setState({
                    boardIsTranslatingWithMouse: false,
                    navigateInterval: undefined,
                    mouseOnTopArea: false,
                    mouseOnBottomArea: false,
                    mouseOnLeftArea: false,
                    mouseOnRightArea: false,
                })
            }

            // Execute navigate
            if (direction != null && isPositive != null && this.state.navigateInterval == undefined) {
                this.navigate(direction, isPositive)
                var navigateInterval = setInterval(this.navigate.bind(this, direction, isPositive), 30)
                this.setState({
                    boardIsTranslatingWithMouse: true,
                    navigateInterval: navigateInterval
                })
            }
        }
    }

    navigate(direction, isPositive) {
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

        if (!this.props.formDisplayed && this.props.mouseIsInViewport) {
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
        } else if (!this.props.mouseIsInViewport) {
            clearInterval(this.state.navigateInterval)
            this.setState({
                boardIsTranslatingWithMouse: false,
                navigateInterval: undefined,
                mouseOnTopArea: false,
                mouseOnBottomArea: false,
                mouseOnLeftArea: false,
                mouseOnRightArea: false
            })
        }
    }

    centerBoard() {
        TweenMax.to(this.refs.board,1, {
            x: this.state.boardCenterX,
            y: this.state.boardCenterY,
            ease: Power2.easeOut
        })
        clearInterval(this.state.navigateInterval)
        this.setState({
            navigateInterval: undefined,
            boardTranslateX: {
                X: this.state.boardCenterX,
                max: 0,
                min: - (this.state.boardWidth - this.props.viewportSize.width)
            },
            boardTranslateY: {
                Y: this.state.boardCenterY,
                max: 0,
                min: - (this.state.boardHeight - this.props.viewportSize.height)
            },
        })
    }

    updateBoardTransform() {
        var self = this

        TweenMax.to(this.refs.board,1, {
            x: this.state.boardTranslateX.X,
            y: this.state.boardTranslateY.Y,
            ease: Power2.easeOut,
        })
    }

    render(){
        // Center board & set min/max board translateX/Y
        let centerX = -((this.state.boardWidth/2) - (this.props.viewportSize.width/2));
        let centerY = -((this.state.boardHeight/2) - (this.props.viewportSize.height/2));

        let style = {
            width: this.state.boardWidth,
            height: this.state.boardHeight,
            transform: 'translate3d('+ centerX +'px,'+ centerY +'px,0)'
        }

        return (
            <section
                ref="board"
                id="babies-board"
                style={style}
                onMouseMove={this.handleMouseMove.bind(this)}
                >

                <BabiesList
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}/>
                <HomeTitle
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                    setFormIsDisplayedProps={this.props.setFormIsDisplayedProps}
                    formDisplayed={this.props.formDisplayed}
                    spaceBarPressed={this.state.spacebarDown}
                    centerBoard={this.centerBoard.bind(this)}/>
            </section>
        )
    }
}
