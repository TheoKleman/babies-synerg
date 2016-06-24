import React from "react"   
import qwest from "qwest"
import GSAP from 'gsap'

import BabiesList from "./BabiesList"
import HomeTitle from "./HomeTitle"

export default class Board extends React.Component {
    constructor() {
        super()

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
            boardIsTranslatingWithScroll: false,
            boardIsTranslatingWithKeys: false,
            spacebarDown: false,
            babyRendered: false
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

        // Set states at the beginning
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
        })
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown.bind(this))
        window.removeEventListener("keypress", this.handleKeyPress.bind(this))
        window.removeEventListener("keyup", this.handleKeyUp.bind(this))
    }

    componentWillReceiveProps(nextProps) {
        let { deltaX, deltaY } = this.props.scrollDelta
        
        // Execute scroll navigate interval
        if ((deltaX != 0 || deltaY != 0) && !this.state.boardIsTranslatingWithScroll && !this.props.isDragging) {
            var navigateScrollInterval = setInterval(this.navigateWithScroll.bind(this), 40)
            this.setState({
                navigateScrollInterval: navigateScrollInterval,
                boardIsTranslatingWithScroll: true
            })
        } else if (deltaX == 0 && deltaY == 0) {
            this.isNotNavigatingWithScroll()
        }

        // Drag board
        // this.setState({
        //     boardTranslateX: {
        //         X: this.state.boardTranslateX.X + this.props.mouseDownDrag.X/2,
        //         max: 0,
        //         min: - (this.state.boardWidth - this.props.viewportSize.width)
        //     },
        //     boardTranslateY: {
        //         Y: this.state.boardTranslateY.Y + this.props.mouseDownDrag.Y/2,
        //         max: 0,
        //         min: - (this.state.boardHeight - this.props.viewportSize.height)
        //     },
        // })
    }

    handleKeyDown(e) {
        // Handle arrow keys only if board is movable
        if (!this.props.formDisplayed) {
            var direction = null
            var isPositive = null

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
                this.isNotNavigatingWithScroll()

                this.navigateWithKeys(direction, isPositive)
                var navigateKeysInterval = setInterval(this.navigateWithKeys.bind(this, direction, isPositive), 25)

                this.setState({
                    boardIsTranslatingWithKeys: true,
                    navigateKeysInterval: navigateKeysInterval
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
        }
    }

    handleKeyUp(e) {
        // Clear navigate interval
        this.isNotNavigatingWithKeys()

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

    navigateWithScroll() {
        let maxSpeed = 90
        let { X } = this.state.boardTranslateX
        let { Y } = this.state.boardTranslateY

        let { deltaX, deltaY } = this.props.scrollDelta

        let newX = 1 * (-deltaX)
        let newY = 1 * (-deltaY)

        // Set max speed
        if (newX > maxSpeed) {
            newX = maxSpeed
        } else if (newX < -maxSpeed) {
            newX = -maxSpeed
        }
        if (newY > maxSpeed) {
            newY = maxSpeed
        } else if (newY < -maxSpeed) {
            newY = -maxSpeed
        }

        // Set new X & Y board values
        X = X + newX
        Y = Y + newY

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

        // Apply
        if (!this.props.formDisplayed) {
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
    }

    navigateWithKeys(direction, isPositive) {
        let { X } = this.state.boardTranslateX
        let { Y } = this.state.boardTranslateY

        switch(direction){
            // Case translate Y
            case "Y":
                if (isPositive) {
                    Y = Y + 30
                } else {
                    Y = Y - 30
                }
                break;
            // Case translate X
            case "X":
                if (isPositive) {
                    X = X + 30
                } else {
                    X = X - 30
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

        if (!this.props.formDisplayed) {
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
    }

    isNotNavigatingWithScroll() {
        clearInterval(this.state.navigateScrollInterval)
        this.setState({
            navigateScrollInterval: undefined,
            boardIsTranslatingWithScroll: false,
        })
    }

    isNotNavigatingWithKeys() {
        clearInterval(this.state.navigateKeysInterval)
        this.setState({
            navigateKeysInterval: undefined,
            boardIsTranslatingWithKeys: false,
        })
    }

    centerBoard() {
        TweenMax.to(this.refs.board,1, {
            x: this.state.boardCenterX,
            y: this.state.boardCenterY,
            ease: Power2.easeOut
        })
        // Clear all navigation intervals
        this.isNotNavigatingWithKeys()
        this.isNotNavigatingWithScroll()
        this.setState({
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
        TweenMax.to(this.refs.board,1, {
            x: this.state.boardTranslateX.X,
            y: this.state.boardTranslateY.Y,
            ease: Power2.easeOut
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
                >

                <BabiesList
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                    setDetailIsDisplayedProps={this.props.setDetailIsDisplayedProps}
                    setBabyDetail={this.props.setBabyDetail}
                    setSorting={this.props.setSorting}
                    isSorting={this.props.isSorting} />
                <HomeTitle
                    boardWidth={this.state.boardWidth}
                    boardHeight={this.state.boardHeight}
                    setFormIsDisplayedProps={this.props.setFormIsDisplayedProps}
                    formDisplayed={this.props.formDisplayed}
                    spaceBarPressed={this.state.spacebarDown}
                    babyRendered={this.state.babyRendered}
                    centerBoard={this.centerBoard.bind(this)}/>
            </section>
        )
    }
}
