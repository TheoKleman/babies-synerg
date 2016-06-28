
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
			babyRendered: false,
			// devsGroupCenterX: 0, 
			// devsGroupCenterY: 0,
			// cdpsGroupCenterX: -(this.state.boardWidth / 4), 
			// cdpsGroupCenterY: (0),
			// marketeuxGroupCenterX: ((3400/4)*3), 
			// marketeuxGroupCenterY: (1900/4),
			// designersGroupCenterX: ((3400/4)*3), 
			// designersGroupCenterY: ((1900/4)*3),
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.isSorted != this.props.isSorted) {
			return true;
		}
		if (nextState.spacebarDown != this.state.spacebarDown) {
			return true;
		}
		if (nextProps.formDisplayed != this.props.formDisplayed) {
			return true;
		}
		if (nextProps.focusedBabyGroup != this.props.focusedBabyGroup) {
			return true;
		}
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
			}
		})
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown.bind(this))
		window.removeEventListener("keypress", this.handleKeyPress.bind(this))
		window.removeEventListener("keyup", this.handleKeyUp.bind(this))
	}

	componentWillReceiveProps(nextProps) {
		// Center board & set min/max board translateX/Y on resize
		if (nextProps.viewportSize.width != this.props.viewportSize.width
			|| nextProps.viewportSize.height != this.props.viewportSize.height) {
			let centerX = -((this.state.boardWidth/2) - (nextProps.viewportSize.width/2));
			let centerY = -((this.state.boardHeight/2) - (nextProps.viewportSize.height/2));
			
			this.setState({
				boardCenterX: centerX,
				boardCenterY: centerY
			})

			this.centerBoardImmediatly(centerX, centerY)
		}

		if(nextProps.focusedBabyGroup != this.props.focusedBabyGroup) {
			this.mooveToFocusedGroup(nextProps.focusedBabyGroup)
		}

		// Scroll board
		let { deltaX, deltaY } = nextProps.scrollDelta

		if (nextProps.scrollDelta != this.props.scrollDelta 
			&& (deltaX != 0 || deltaY != 0) 
			&& !this.state.boardIsTranslatingWithScroll) {
			
			var navigateScrollInterval = setInterval(this.navigateWithScroll.bind(this), 20)
			this.setState({
				navigateScrollInterval: navigateScrollInterval,
				boardIsTranslatingWithScroll: true
			})
		} else if (deltaX == 0 && deltaY == 0) {
			this.isNotNavigatingWithScroll()
		}
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
			// Spacebar
			else if (e.keyCode == 32 && !this.state.spacebarDown) {
				// Center board 
				this.centerBoard()
			}

			// Execute navigate
			if (direction != null 
				&& isPositive != null 
				&& !this.state.boardIsTranslatingWithKeys) {
				this.isNotNavigatingWithScroll()

				this.navigateWithKeys(direction, isPositive)
				var navigateKeysInterval = setInterval(this.navigateWithKeys.bind(this, direction, isPositive), 25)

				this.setState({
					navigateKeysInterval: navigateKeysInterval,
					boardIsTranslatingWithKeys: true
				})
			}
		}
	}

	handleKeyPress(e) {
		var self = this;

		// Spacebar - Open form modal
		if (e.keyCode == 32 && !this.props.formDisplayed && !this.state.spacebarDown) {
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
		let maxSpeed = 60
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
		X += newX
		Y += newY

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

			this.updateBoardTransformOnScroll()
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
			navigateScrollInterval: 0,
			boardIsTranslatingWithScroll: false
		})
	}

	isNotNavigatingWithKeys() {
		clearInterval(this.state.navigateKeysInterval)
		this.setState({
			navigateKeysInterval: 0,
			boardIsTranslatingWithKeys: false,
		})
	}

	centerBoardImmediatly(centerX, centerY) {
		TweenMax.to(this.refs.board,0, {
			x: centerX,
			y: centerY
		})
		// Clear all navigation intervals
		this.isNotNavigatingWithKeys()
		this.isNotNavigatingWithScroll()
		this.setState({
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

	centerBoard() {
		TweenMax.to(this.refs.board,1.5, {
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

	updateBoardTransformOnScroll() {
		TweenMax.to(this.refs.board,.2, {
			x: this.state.boardTranslateX.X,
			y: this.state.boardTranslateY.Y,
			ease: Power0.linear
		})
	}

	boardTransformToGroup(posX, posY) {
		TweenMax.to(this.refs.board,1, {
			x: posX,
			y: posY,
			ease: Power2.easeOut
		})
	}
	
	mooveToFocusedGroup(group) {

		console.log("group: "+group)
		
		if(group == "cdps") {
			
			this.boardTransformToGroup(0, (-(this.state.boardHeight / 2)- 60))
			this.updateStateAfterTranslation(0, (-(this.state.boardHeight / 2)- 60))
		}
		if(group == "designers") {

			this.boardTransformToGroup(-(this.state.boardWidth / 2), (-(this.state.boardHeight / 3) - 60))
			this.updateStateAfterTranslation(-(this.state.boardWidth / 2), (-(this.state.boardHeight / 3) - 60))
		}
		if(group == "devs") {
			
			this.boardTransformToGroup(0, 0)
			this.updateStateAfterTranslation(0, 0)
		}
		if(group == "marketeux") {

			this.boardTransformToGroup(-(this.state.boardWidth / 2.5), 0)
			this.updateStateAfterTranslation(-(this.state.boardWidth / 2.5), 0)
		}
	}

	updateStateAfterTranslation(posX, posY) {
		this.setState({
			boardTranslateX: {
				X: posX,
				max: 0,
				min: - (this.state.boardWidth - this.props.viewportSize.width)
			},
			boardTranslateY: {
				Y: posY,
				max: 0,
				min: - (this.state.boardHeight - this.props.viewportSize.height)
			},
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
					setSorting={this.props.setSorting}
					isSorted={this.props.isSorted}
					formDisplayed={this.props.formDisplayed}
					toggleBabyIsHovered={this.props.toggleBabyIsHovered.bind(this)} />
				<HomeTitle
					boardWidth={this.state.boardWidth}
					boardHeight={this.state.boardHeight}
					setFormIsDisplayedProps={this.props.setFormIsDisplayedProps}
					formDisplayed={this.props.formDisplayed}
					isSpaceBarPressed={this.state.spacebarDown}
					babyRendered={this.state.babyRendered}
					centerBoard={this.centerBoard.bind(this)}/>
			</section>
		)
	}
}
