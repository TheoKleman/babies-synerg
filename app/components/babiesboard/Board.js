
import React, { Component, PropTypes } from "react"
import GSAP from 'gsap'

import BabiesList from "./BabiesList"
import HomeTitle from "./HomeTitle"
import Stat from "./Stat"

export default class Board extends Component {
	constructor() {
		super()

		this.state = {
			boardIsTranslatingWithScroll: false,
			boardIsTranslatingWithKeys: false,
			spacebarDown: false,
			babyRendered: false
		}

		this.boardWidth = 3400
		this.boardHeight = 1900
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.isSorted != this.props.isSorted) {
			return true
		} else if (nextState.spacebarDown != this.state.spacebarDown) {
			return true
		} else if (nextProps.formDisplayed != this.props.formDisplayed) {
			return true
		} else if (nextProps.focusedBabyGroup != this.props.focusedBabyGroup) {
			return true
		} else if (nextProps.isSoundActive != this.props.isSoundActive) {
			return true
		} else {
			return false
		}
	}

	componentWillMount() {
		// Add event listener
		window.addEventListener('wheel', this.handleScroll.bind(this))
		window.addEventListener('keydown', this.handleKeyDown.bind(this))
		window.addEventListener('keypress', this.handleKeyPress.bind(this))
		window.addEventListener("keyup", this.handleKeyUp.bind(this))
		
		// Set board DOM Elem
		this.setState({
			viewportSize: this.props.viewportSize
		})

		// Center board & set min/max board translateX/Y
		let centerX = -((this.boardWidth/2) - (this.props.viewportSize.width/2));
		let centerY = -((this.boardHeight/2) - (this.props.viewportSize.height/2));

		// Set states at the beginning
		this.setState({
			boardCenterX: centerX,
			boardCenterY: centerY,
			boardTranslateX: {
				X: centerX,
				max: 0,
				min: - (this.boardWidth - this.props.viewportSize.width)
			},
			boardTranslateY: {
				Y: centerY,
				max: 0,
				min: - (this.boardHeight - this.props.viewportSize.height)
			}
		})
	}

	componentWillUnmount() {
		window.removeEventListener('wheel', this.handleScroll.bind(this))
		window.removeEventListener("keydown", this.handleKeyDown.bind(this))
		window.removeEventListener("keypress", this.handleKeyPress.bind(this))
		window.removeEventListener("keyup", this.handleKeyUp.bind(this))
	}

	componentWillReceiveProps(nextProps) {
		// Center board & set min/max board translateX/Y on resize
		if (nextProps.viewportSize.width != this.props.viewportSize.width
			|| nextProps.viewportSize.height != this.props.viewportSize.height) {
			let centerX = -((this.boardWidth/2) - (nextProps.viewportSize.width/2));
			let centerY = -((this.boardHeight/2) - (nextProps.viewportSize.height/2));
			
			this.setState({
				boardCenterX: centerX,
				boardCenterY: centerY
			})

			this.centerBoardImmediatly(centerX, centerY)
		}

		if(nextProps.focusedBabyGroup != this.props.focusedBabyGroup) {
			this.mooveToFocusedGroup(nextProps.focusedBabyGroup)
		}
	}

	handleScroll(e) {
		e.preventDefault()
		var deltaX = e.deltaX
		var deltaY = e.deltaY

		let maxSpeed = 60
		let { X } = this.state.boardTranslateX
		let { Y } = this.state.boardTranslateY

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
		if (this.props.canTranslate) {
			this.setState({
				boardIsTranslatingWithScroll: true,
				boardTranslateX: {
					X: X,
					max: 0,
					min: - (this.boardWidth - this.props.viewportSize.width)
				},
				boardTranslateY: {
					Y: Y,
					max: 0,
					min: - (this.boardHeight - this.props.viewportSize.height)
				}
			})

			this.updateBoardTransformOnScroll()
		}
	}

	handleKeyDown(e) {
		// Handle arrow keys only if board is movable
		if (this.props.canTranslate) {
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
				}, 1200)
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

		if (this.props.canTranslate) {
			this.setState({
				boardTranslateX: {
					X: X,
					max: 0,
					min: - (this.boardWidth - this.props.viewportSize.width)
				},
				boardTranslateY: {
					Y: Y,
					max: 0,
					min: - (this.boardHeight - this.props.viewportSize.height)
				}
			})

			this.updateBoardTransform()
		}
	}

	isNotNavigatingWithScroll() {
		this.setState({
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
				min: - (this.boardWidth - this.props.viewportSize.width)
			},
			boardTranslateY: {
				Y: centerY,
				max: 0,
				min: - (this.boardHeight - this.props.viewportSize.height)
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
				min: - (this.boardWidth - this.props.viewportSize.width)
			},
			boardTranslateY: {
				Y: this.state.boardCenterY,
				max: 0,
				min: - (this.boardHeight - this.props.viewportSize.height)
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

	updateBoardTransformToFocusedGroup(posX, posY) {
		TweenMax.to(this.refs.board,1, {
			x: posX,
			y: posY,
			ease: Power2.easeOut
		})
	}
	
	mooveToFocusedGroup(group) {		
		if(group == "cdps") {
			this.updateStateAfterTranslation(0, (-(this.boardHeight / 2)- 60))
		}
		if(group == "creatifs") {
			this.updateStateAfterTranslation(-(this.boardWidth / 2), (-(this.boardHeight / 3) - 200))
		}
		if(group == "devs") {
			this.updateStateAfterTranslation(0, 0)
		}
		if(group == "marketeux") {
			this.updateStateAfterTranslation(-(this.boardWidth / 2.5), 0)
		}
	}

	updateStateAfterTranslation(posX, posY) {
		// Check if X is in range
		if (posX < this.state.boardTranslateX.min) {
			posX = this.state.boardTranslateX.min
		} else if (posX > this.state.boardTranslateX.max){
			posX = this.state.boardTranslateX.max
		}
		// Check if Y is in range
		if (posY < this.state.boardTranslateY.min) {
			posY = this.state.boardTranslateY.min
		} else if (posY > this.state.boardTranslateY.max){
			posY = this.state.boardTranslateX.max
		}

		// Set states
		this.setState({
			boardTranslateX: {
				X: posX,
				max: this.boardWidth,
				min: - (this.boardWidth - this.props.viewportSize.width)
			},
			boardTranslateY: {
				Y: posY,
				max: this.boardHeight,
				min: - (this.boardHeight - this.props.viewportSize.height)
			},
		})

		// The execute
		this.updateBoardTransformToFocusedGroup(posX, posY)
	}

	render(){
		// Center board & set min/max board translateX/Y
		let centerX = -((this.boardWidth/2) - (this.props.viewportSize.width/2));
		let centerY = -((this.boardHeight/2) - (this.props.viewportSize.height/2));
		let style = {
			width: this.boardWidth,
			height: this.boardHeight,
			transform: 'translate3d('+ centerX +'px,'+ centerY +'px,0)'
		}

		if(this.props.isSorted) {
			var stat1 = <Stat
					groupId="devs-stat"
					groupName="Développeurs"
					groupCount="32"
					statPercent="67%"
					playOrPrefer="play"
					isSorted={this.props.setSorting}
					isSoundActive={this.props.isSoundActive} />
			var stat2 = <Stat
					groupId="creatifs-stat"
					groupName="Créatifs"
					groupCount="51"
					statPercent="75%"
					playOrPrefer="play"
					isSorted={this.props.setSorting}
					isSoundActive={this.props.isSoundActive} />
			var stat3 = <Stat
					groupId="cdps-stat"
					groupName="Chefs de projet"
					groupCount="21"
					statPercent="63%"
					playOrPrefer="prefer"
					isSorted={this.props.setSorting}
					isSoundActive={this.props.isSoundActive} />
			var stat4 =	<Stat
					groupId="marketeux-stat"
					groupName="Marketeux"
					groupCount="15"
					statPercent="79%"
					playOrPrefer="prefer"
					isSorted={this.props.setSorting}
					isSoundActive={this.props.isSoundActive} />
		}

		let groupToAnimate
		if(this.state.groupToAnimate != 'undefined') {
			groupToAnimate = this.state.groupToAnimate
		}

		return (
			<section
				ref="board"
				id="babies-board"
				style={style}
				>
				<BabiesList
					boardWidth={this.boardWidth}
					boardHeight={this.boardHeight}
					setSorting={this.props.setSorting}
					isSorted={this.props.isSorted}
					formDisplayed={this.props.formDisplayed}
					spacebarDown={this.state.spacebarDown}
					isSoundActive={this.props.isSoundActive}
					viewportSize={this.state.viewportSize} />
				<HomeTitle
					boardWidth={this.boardWidth}
					boardHeight={this.boardHeight}
					setFormIsDisplayedProps={this.props.setFormIsDisplayedProps}
					formDisplayed={this.props.formDisplayed}
					spacebarDown={this.state.spacebarDown}
					babyRendered={this.state.babyRendered}
					centerBoard={this.centerBoard.bind(this)}
					isSoundActive={this.props.isSoundActive} />
					{stat1}
					{stat2}
					{stat3}
					{stat4}
			</section>
		)
	}
}
