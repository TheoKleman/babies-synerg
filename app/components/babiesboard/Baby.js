import React from 'react'
import qwest from "qwest"
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable'
import GSAP from 'gsap'
import SpriteAnimator from 'react-sprite-animator'

import DetailBaby from "./DetailBaby"
var interact = require('interact.js');
var classNames = require('classnames')

export default class Baby extends React.Component {
	constructor() {
		super()

		this.state = {
			isHovering: false,
			iNeighbourg: false,
			globalDrag: null,
			updateAngle: true,
			isDragging: false,
			isDisplayedBabyDetail: false,
			isCloseBorder: false,
			isMooving: false,
			hideAnimationSprite: false,
			shouldAnimate: true,
		}

		this.rotateAngleLimit = 40
		this.ohAudio = document.createElement('audio');
		this.ohAudio.src = './media/oh.wav'
		this.youpiAudio = document.createElement('audio');
		this.youpiAudio.src = './media/youpi.wav'
	}

	shouldComponentUpdate(nextProps, nextState) {
		if(nextProps.formDisplayed != this.props.formDisplayed) {
			return true
		} else if(nextProps.babies != this.props.babies) {
			return true
		} else if(nextProps.pos != this.props.pos) {
			return true
		} else if(nextProps.datas != this.props.datas) {
			return true
		} else if(nextProps.isSorted != this.props.isSorted) {
			return true
		} else if(nextState.isMooving != this.state.isMooving) {
			return true
		} else if(nextState.isDragging != this.state.isDragging) {
			return true
		} else if(nextState.isDisplayedBabyDetail != this.state.isDisplayedBabyDetail) {
			return true
		} else if(nextState.color != this.state.color) {
			return true
		} else if(nextState.transform != this.state.transform) {
			return true
		}

		return false
	}

    componentWillMount() {
    	this.setBabySpec()
    }

	componentDidMount() {
		this.setPosition(this.props.pos.origin)
		this.enableDrag(true)
		this.randomizeSkin()

		if(this.props.pos.origin.Xpx > 3000) {
			this.setState({
				isCloseBorder: true
			})	
		}
	}

	componentDidUpdate() {
		if (!this.state.isReady) {
			this.setState({
				isReady: true,
			})

			this.props.setBabyReady(this.props.id)
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.spacebarDown != this.props.spacebarDown) {

			if(this.refs.itSelf.canDoHola) {
				TweenMax.to(
					this.refs.itSelf,
					0.3,
				 {
					scale: 2,
					ease: Power1.easeOut,
				})
			}
		}
	}

	randomizeSkin() {
		switch(this.props.datas.tag) {
			case "Créatif":
				this.setState({
					skin: "blue",
					color: "blue",
					head: this.getRandomNumber(1, 2),
					animation: this.getRandomNumber(1, 4),
					hasSprite: this.getRandomNumber(1, 2)
				})
				break;
			case "Développeur":
				this.setState({
					skin: "orange",
					color: "orange",
					head: this.getRandomNumber(3, 4),
					animation: this.getRandomNumber(1, 4),
					hasSprite: this.getRandomNumber(1, 2)
				})
				break;
			case "Chef de projet":
				this.setState({
					skin: "yellow",
					color: "yellow",
					head: this.getRandomNumber(1, 2),
					animation: this.getRandomNumber(1, 4),
					hasSprite: this.getRandomNumber(1, 2)
				})
				break;
			case "Marketeux":
				this.setState({
					skin: "green",
					color: "green",
					head: this.getRandomNumber(3, 4),
					animation: this.getRandomNumber(1, 4),
					hasSprite: this.getRandomNumber(1, 2)
				})
				break;
			default:
				this.setState({
					skin: "yellow",
					color: "yellow",
					head: this.getRandomNumber(1, 2),
					animation: this.getRandomNumber(1, 4),
					hasSprite: this.getRandomNumber(1, 2)
				})
		}

	}

	enableDrag(value) {
		if(value) {
			interact(this.refs.itSelf).draggable({
				inertia: {
					resistance: 10,
					minSpeed: 200,
					endSpeed: 100,
					smoothEndDuration: 100,
				},
				restrict: {
					restriction: 'parent',
					elementRect: { top: 0, left: 0, bottom: 1.5, right: 1.5 }
				},
				onmove: this.onDragListener.bind(this),
				onend: this.onDragStop.bind(this),
				pointerMoveTolerance: 10
			})
		} else {
			interact(this.refs.itSelf).draggable(value)
		}
	}

	onDragListener(event) {
		var self = this

		// Play oh song
		if (!this.state.isDragging && this.props.isSoundActive) {
			this.ohAudio.play()

			var delay = Math.floor(Math.random() * (1200 - 700 + 1)) + 700

			setTimeout(function(){
				self.youpiAudio.play()
			}, delay)
		}

		this.setState({
			isDragging: true,
			isMooving: true
		})

		TweenMax.set(this.refs.babyPieces, {
			opacity: 1
		})

		var baseX = this.props.pos.origin.Xpx,
			baseY = this.props.pos.origin.Ypx - 40

		var boardWidth = document.getElementById('babies-board').clientWidth,
			boardHeight = document.getElementById('babies-board').clientHeight,
			viewportWidth = window.innerWidth,
			viewportHeight = window.innerHeight

		var target = event.target,
		    // keep the dragged position in the data-x/data-y attributes
		    x = (parseFloat(target.getAttribute('data-x')) || baseX) + event.dx,
		    y = (parseFloat(target.getAttribute('data-y')) || baseY) + event.dy;

		// Rotate baby here //
		this.makeBabyRotate(x)

		// translate the element
		target.style.webkitTransform =
		target.style.transform =
		  'translate(' + (x) + 'px, ' + (y) + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);

		this.setState({
			isDisplayedBabyDetail: false
		})
	}

	onDragStop(event) {
		var babyContent = document.getElementById(event.target.id).firstChild
		babyContent.style.transform = "rotate(0deg)"

		this.setState({
			transform: "rotate(0deg)",
			transformArms: "rotate(0deg)",
		})

		this.setState({
			isDragging: false,
			isMooving: false,
		})

		TweenMax.set(this.refs.babyPieces, {
			opacity: 0
		})
	}

	setBabySpec(){
		let response = this.props.babySpec

		this.setState({
            maxW: response.maxW,
			maxH: response.maxH,
			babyWidth: response.babyWidth,
			babyHeight: response.babyHeight,
			style: {
				top: response.style.top,
				left: response.style.left,
				zIndex: response.style.zIndex,
			},
			isHovering: response.isHovering,
			iNeighbourg: response.iNeighbourg,
			savedTop: response.savedTop,
			savedLeft: response.savedLeft,
        })

		this.getBabySkin(this.props.datas.tag)
	}

	setPosition(pos){
		let tl = new TimelineLite ()
		tl.set(
      	this.refs.itSelf,
	      {
	        x: pos.Xpx +"px",
	        y: pos.Ypx - 100 +"px",
	        zIndex: pos.y
	      }
	    )

	    let xMin = (this.props.boardWidth / 2) - (this.props.viewportSize.width / 2)
	    let xMax = (this.props.boardWidth / 2) + (this.props.viewportSize.width / 2)
	    let yMin = (this.props.boardHeight / 2) - (this.props.viewportSize.height / 2)
	    let yMax = (this.props.boardHeight / 2) + (this.props.viewportSize.height / 2)

	    if(xMin < pos.Xpx  && pos.Xpx < xMax) {
	    	if(pos.Ypx > yMin && pos.Ypx < yMax) {
	    		this.setState({
	    			canDoHola: true
	    		})
	    	}
	    }
	}

	updatePosition(posDestination, posOrigin){
		if(posDestination != null && posOrigin != null) {
			let tl = new TimelineLite ()
			tl.to(
	      	this.refs.itSelf,
	      	4,
		      {
		        x: posDestination.Xpx +"px",
		        y: posDestination.Ypx +"px",
		        zIndex: posDestination.y,
		        ease: Power1.easeOut,
		        onStart: this.onBabySort(posDestination, posOrigin),
		        onComplete: this.onBabySortEnd.bind(this),
		      }
		    )
		}
	}

	onBabySort(posDestination, posOrigin) {
		this.setState({
			hideAnimationSprite: true
		})

		var babyRotation = this.rotateBabyOnSort(posDestination.Xpx, posOrigin.Xpx, this.rotateAngleLimit)
		var babySmallRotation = this.rotateBabyOnSort(posDestination.Xpx, posOrigin.Xpx, 20)

		TweenMax.allTo(
			[this.refs.armRight, this.refs.armLeft],
			0.3,
		 {
			rotation: babySmallRotation,
			delay: 0.1,
			ease: Power1.easeOut,
		})

		TweenMax.to(
			this.refs.armRight,
			0.3,
		 {
			rotation: 0,
			delay: 3,
			ease: Power1.easeOut,
		})
	}

	onBabySortEnd() {
		TweenMax.set(this.refs.babyPieces, {
			opacity: 0
		})

		this.setState({
			isDragging: false
		})
	}

	getRandomNumber(limitInf, limitSup) {
 		return Math.floor(Math.random() * (limitSup-limitInf+1)+limitInf)
 	}

 	shouldBabyAnimate(value) {
 		return value
 	}

	makeBabyRotate(direction) {
		var babyRotation = this.rotateBaby(direction, this.rotateAngleLimit)

		this.refs.itSelf.style.transform = "rotate("+babyRotation+"deg)"

		this.setState({
			transform: "rotate("+babyRotation+"deg)",
			transformArms: "rotate("+babyRotation+"deg)",
		})
	}

	rotateBabyOnSort(destination, origin, rotateAngleLimit) {
		var angle = 0

		if(destination > origin) {
			angle = destination - origin
			origin = destination
			if(angle > rotateAngleLimit) {
				angle = rotateAngleLimit
				return angle
			} else {
				return angle
			}
		} else {
			angle = destination - origin
			origin = destination
			if(angle < -rotateAngleLimit) {
				angle = -rotateAngleLimit
				return angle
			} else {
				return angle
			}
		}
	}

	rotateBaby(direction, rotateAngleLimit) {
		var angle = 0

		if(direction > this.state.savedX) {
			angle = direction - this.state.savedX
			this.state.savedX = direction
			if(angle > rotateAngleLimit) {
				angle = rotateAngleLimit
				return angle
			} else {
				return angle
			}
		} else {
			angle = direction - this.state.savedX
			this.state.savedX = direction
			if(angle < -rotateAngleLimit) {
				angle = -rotateAngleLimit
				return angle
			} else {
				return angle
			}
		}
	}

	getBabySkin(skill) {

        let babySKin = '';
	}

	getBabyColor(skill) {

        let babySKin = '';

        switch(skill) {
        	case "Créatif":
        		return "blue"
        		break;
        	case "Développeur":
        		return "orange"
        		break;
        	case "Chef de projet":
        		return "yellow"
        		break;
        	case "Marketeux":
        		return "green"
        		break;
        	default:
        		return "yellow"
        }
	}

	componentWillReceiveProps(nextProps) {
		if( nextProps.formDisplayed != this.props.formDisplayed) {
			if(this.props.formDisplayed) {
				this.enableDrag(true)
				if(this.refs.bodyAnimation) {
					if(this.refs.bodyAnimation.props.shouldBeAnimated) {
						this.setState({
							shouldAnimate: true
						})
					}
				}
			} else {
				this.enableDrag(false)
				if(this.refs.bodyAnimation) {
					if(this.refs.bodyAnimation.props.shouldAnimate) {
						this.setState({
							shouldAnimate: false
						})
					}
				}
			}
		}
		if(nextProps.isSorted != this.props.isSorted ) {
			if(this.props.isSorted) {
				this.enableDrag(true)
				if(this.refs.bodyAnimation) {
					if(this.refs.bodyAnimation.props.shouldBeAnimated) {
						this.setState({
							shouldAnimate: true
						})
					}
				}
				TweenMax.set(this.refs.babyPieces, {
					opacity: 1
				})

				this.setState({
					isDragging: true
				})

				this.updatePosition(this.props.pos.origin, this.props.pos.destination)
			} else {
				this.enableDrag(false)
				if(this.refs.bodyAnimation) {
					if(this.refs.bodyAnimation.props.shouldAnimate) {
						this.setState({
							shouldAnimate: false
						})
					}
				}
				TweenMax.set(this.refs.babyPieces, {
					opacity: 1
				})

				this.setState({
					isDragging: true
				})

				this.updatePosition(this.props.pos.destination, this.props.pos.origin)
			}
		}
	}

	isBlue(value) {
		if(value == "blue")
			return true
		else
			return false
	}
	isOrange(value) {
		if(value == "orange")
			return true
		else
			return false
	}
	isYellow(value) {
		if(value == "yellow")
			return true
		else
			return false
	}
	isGreen(value) {
		if(value == "green")
			return true
		else
			return false
	}

	handleMouseEnter(e) {
		this.setState({
			'isHovering': true
		})
		if(!this.props.formDisplayed && !this.props.isSorted) {
			this.setState({
				isDisplayedBabyDetail: true,
			})
			TweenMax.to(this.refs.itSelf, .2, {
				zIndex: 200,
				ease: Power4.easeOut,
			})
		}
	}

	handleMouseLeave(e) {
		this.setState({
			'isHovering': false
		})
		if(!this.props.formDisplayed && !this.props.isSorted) {
			this.setState({
				isDisplayedBabyDetail: false
			})
			TweenMax.to(this.refs.itSelf, .1, {
				zIndex: this.props.pos.origin.y,
				ease: Power2.easeOut,
			})
		}
	}

	handleMouseDown(e) {
		let babyDatas = this.props.datas
	}

	render() {
		const id = "baby-"+this.props.id

		var babyClasses = classNames({
			'baby': true,
			'hovered': this.state.isHovering,
			'neighbourg': this.state.isNeighbourg,
			'disabled': this.props.isSorted,
			'blue': this.isBlue(this.state.color),
			'orange': this.isOrange(this.state.color),
			'yellow': this.isYellow(this.state.color),
			'green': this.isGreen(this.state.color),
			'close-border': this.state.isCloseBorder
		})

		var piecesClasses = classNames({
			'baby-pieces': true,
			'moving': this.state.isDragging,
		})

		if(this.state.head) {
			var babyStyle = {
				backgroundImage: "url(/images/sprites/"+this.state.skin+"/head"+this.state.head+"/baby-body-full.png)",
				backgroundSize: "cover"
			}
		}

		var bodyAnimationClasses = classNames({
			'baby-bg': true,
			'moving': this.state.isDragging,
		})

		var babyStaticBgClasses = classNames({
			'baby-bg': true,
			'sized': true,
			'moving': this.state.isDragging
		})

		if(this.state.hasSprite != 0) {
			if(this.state.hasSprite % 2 == 0) {

				if (this.state.head != "undefined" && this.state.animation != 'undefined') {

					var animationUrl = "/images/sprites/"+this.state.skin+"/head"+this.state.head+"/anim"+this.state.animation+"/animation.png"
					var shouldAnimate = this.props.id < 20 && this.state.shouldAnimate ? true : false
					var shouldBeAnimated = this.props.id < 0 ? true : false
					//var shouldBeAnimated = false

					var animator = <SpriteAnimator
						ref="bodyAnimation"
						className={bodyAnimationClasses}
						sprite={animationUrl}
						width={200}
						height={200}
						timeout={80}
						shouldBeAnimated={shouldBeAnimated}
						shouldAnimate={shouldAnimate} />
					// var animator = <div className={bodyAnimationClasses}></div>
				}
			} else {
				var animator = <div
					ref="bodyImage"
					className={babyStaticBgClasses}
					style={babyStyle} />
				// var animator = <div className={bodyAnimationClasses}></div>
			}
		}

		if(this.state.head) {
			var babyBody = "/images/sprites/"+this.state.skin+"/head"+this.state.head+"/baby-body.png"
		}

		var onClickEvent = !this.props.isSorted ? this.handleMouseDown.bind(this) : null,
			onMouseEnterEvent = !this.state.isMooving ? this.handleMouseEnter.bind(this) : null

		return(
			<div
			className={babyClasses}
			onMouseEnter={onMouseEnterEvent}
			onMouseLeave={this.handleMouseLeave.bind(this)}
			id={id}
			ref="itSelf">
				<DetailBaby
					ref="detail"
					color={this.getBabyColor(this.props.datas.tag)}
					babyDetail={this.props.datas}
					isMooving={this.state.isMooving}
					isDisplayedBabyDetail={this.state.isDisplayedBabyDetail}
					onMouseDown={this.handleMouseDown} />
				<div className="the-baby" style={{transform: this.state.transform}}>
					{animator}
					<div ref="babyPieces" className={piecesClasses}>
						<span className="baby-body"><img src={babyBody} alt="baby body"/></span>
						<span ref="armRight" className="baby-arm-right" style={{transform: this.state.transformArms}}><img src="/images/right-arm.png" alt="baby right arm"/></span>
						<span ref="armLeft" className="baby-arm-left" style={{transform: this.state.transformArms}}><img src="/images/left-arm.png" alt="baby left arm"/></span>
						<span ref="legRight" className="baby-leg-right" style={{transform: this.state.transformArms}}><img src="/images/right-leg.png" alt="baby right leg"/></span>
						<span ref="legLeft" className="baby-leg-left" style={{transform: this.state.transformArms}}><img src="/images/left-leg.png" alt="baby left leg"/></span>
					</div>
				</div>
			</div>
		);
	}
}
