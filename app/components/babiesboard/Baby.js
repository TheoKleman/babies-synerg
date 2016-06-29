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
			maxW: 0,
			maxH: 0,
			babyWidth: 0,
			babyHeight: 0,
			style: {
				top: "0px",
				left: "0px",
				zIndex: 0,
			},
			isHovering: false,
			iNeighbourg: false,
			savedTop: 0,
			savedLeft: 0,
			globalDrag: null,
			savedX: 0,
			updateAngle: true,
			isDragging: false,
			isDisplayedBabyDetail: false,
			rotateAngleLimit: 40,
			isMooving: false,
			hasSprite: 0,
			hideAnimationSprite: false,
		}
	}

    componentWillMount() {
    	this.setBabySpec()
    }

	componentDidMount() {
		this.setPosition(this.props.pos.origin)

		this.enableDrag(true)

		this.randomizeAnimation()
	}

	randomizeAnimation() {
		if(this.props.datas.tag == "Créatif") {
			this.setState({
				head: this.getRandomNumber(1, 2),
				animation: this.getRandomNumber(1, 4),
				hasSprite: this.getRandomNumber(1, 2),
			})
		}
		if(this.props.datas.tag == "Développeur") {
			this.setState({
				head: this.getRandomNumber(3, 4),
				animation: this.getRandomNumber(1, 4),
				hasSprite: this.getRandomNumber(1, 2),
			})
		}
		if(this.props.datas.tag == "Chef de projet") {
			this.setState({
				head: this.getRandomNumber(1, 2),
				animation: this.getRandomNumber(1, 4),
				hasSprite: this.getRandomNumber(1, 2),
			})
		}
		if(this.props.datas.tag == "Marketeux") {
			this.setState({
				head: this.getRandomNumber(3, 4),
				animation: this.getRandomNumber(1, 4),
				hasSprite: this.getRandomNumber(1, 2),
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
		this.setState({
			isDragging: true
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
		console.log("drag stop")
		var babyContent = document.getElementById(event.target.id).firstChild
		babyContent.style.transform = "rotate(0deg)"

		this.setState({
			transform: babyContent.style.transform,
			transformArms: "rotate(0deg)",
		})

		this.setState({
			isDragging: false
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
		// this.refs.bodyAnimation.props.shouldAnimate = false
		this.setState({
			hideAnimationSprite: true
		})

		var babyRotation = this.rotateBabyOnSort(posDestination.Xpx, posOrigin.Xpx, this.state.rotateAngleLimit)
		
		TweenMax.set(this.refs.babyPieces, {
			opacity: 1
		})
		if(this.refs.bodyImage) {
			TweenMax.set(this.refs.bodyImage, { opacity: 0 })	
		}
		if(this.refs.bodyAnimation) {
			TweenMax.set(this.refs.bodyAnimation, { opacity: 0 })	
		}
		
		// TweenMax.allTo(
		// 	[this.refs.armRight, this.refs.armLeft, this.refs.legRight, this.refs.legLeft],
		// 	2,
		//  {
		// 	rotation: babyRotation,
		// 	delay: 0.2,
		// 	ease: Power1.easeOut,
		// })
		// TweenMax.allTo(
		// 	[this.refs.armRight, this.refs.armLeft, this.refs.legRight, this.refs.legLeft],
		// 	1.3,
		//  {
		// 	rotation: 0,
		// 	delay: 3,
		// 	ease: Elastic.easeOut.config(0.5, 0.3),
		// })
		let tl = new TimelineLite ()
			tl.to(
	      	[this.refs.legLeft, this.refs.legRight],
	      	0.3,
		      {
		        y: 10,
		        ease: Power1.easeOut,
		        repeat: 10,
		      }
		    )
	}

	onBabySortEnd() {
		TweenMax.set(this.refs.babyPieces, {
			opacity: 0
		})
		if(this.refs.bodyImage) {
			TweenMax.set(this.refs.bodyImage, { opacity: 1 })	
		}
		if(this.refs.bodyAnimation) {
			TweenMax.set(this.refs.bodyAnimation, { opacity: 1 })	
		}
	}

	getRandomNumber(limitInf, limitSup) {	
 		return Math.floor(Math.random() * (limitSup-limitInf+1)+limitInf)
 	}

 	shouldBabyAnimate(value) {
 		return value
 	}

	makeBabyRotate(direction) {
		var babyRotation = this.rotateBaby(direction, this.state.rotateAngleLimit)

		this.refs.itSelf.style.transform = "rotate("+babyRotation+"deg)"

		this.setState({
			transform: this.refs.itSelf.style.transform,
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

        switch(skill) {
        	case "Créatif":
        		this.setState({
        			skin: "blue",
        			color: "blue"
        		})
        		break;
        	case "Développeur":
        		this.setState({
        			skin: "orange",
        			color: "orange"
        		})
        		break;
        	case "Chef de projet":
        		this.setState({
        			skin: "yellow",
        			color: "yellow"
        		})
        		break;
        	case "Marketeux":
        		this.setState({
        			skin: "green",
        			color: "green"
        		})
        		break;
        	default:
        		this.setState({
        			skin: "yellow",
        			color: "yellow"
        		})
        }
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

	componentDidUpdate() {
		
	}

	componentWillReceiveProps(nextProps) {
		if( nextProps.formDisplayed != this.props.formDisplayed) {
			if(this.props.formDisplayed) {
				this.enableDrag(true)
			} else {
				this.enableDrag(false)
			}
		}
		if(nextProps.isSorted != this.props.isSorted ) {
			if(this.props.isSorted) {
				this.enableDrag(true)
				this.updatePosition(this.props.pos.origin, this.props.pos.destination)
			} else {
				this.enableDrag(false)
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

	handleMouseEnter(e, id) {
		if(!this.props.formDisplayed && !this.props.isSorted) {
			this.props.toggleBabyIsHovered(true)
			this.setState({
				isDisplayedBabyDetail: true
			})
			TweenMax.to(this.refs.itSelf, .3, {
				zIndex: 200,
				ease: Power2.easeOut,
			})
		}
	}

	handleMouseLeave(e) {
		this.props.toggleBabyIsHovered(false)
		this.setState({
			isDisplayedBabyDetail: false
		})
		TweenMax.to(this.refs.itSelf, .1, {
			zIndex: this.props.pos.origin.y,
			ease: Power2.easeOut,
		})
	}

	handleMouseDown(e) {
		let babyDatas = this.props.datas	
	}

	render() {

		const id = "baby-"+this.props.id
		let color= this.state.color

		var babyClasses = classNames({
			'baby': true,
			'hovered': this.state.isHovering,
			'neighbourg': this.state.isNeighbourg,
			'disabled': this.props.isSorted,
			'blue': this.isBlue(color),
			'orange': this.isOrange(color),
			'yellow': this.isYellow(color),
			'green': this.isGreen(color),
		})

		var piecesClasses = classNames({
			'baby-pieces': true,
			'moving': this.state.isDragging,
		})

		var babyStyle = {
			backgroundImage: "url(/images/sprites/"+this.state.skin+"/head"+this.state.head+"/baby-body-full.png)",
			backgroundSize: "cover"
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
					var shouldAnimate = this.props.id < 10 ? true : false

					var animator = <SpriteAnimator
						ref="bodyAnimation"
						className={bodyAnimationClasses}	
						sprite={animationUrl}
						width={200}
						height={200}
						timeout={80}
						shouldAnimate={shouldAnimate} />
				}
			} else {
				var animator = <div 
					ref="bodyImage"
					className={babyStaticBgClasses}
					style={babyStyle} />
			}
		}

		if(this.state.head) {
			console.log(this.props.datas.tag)
			console.log(this.state.head)
			var babyBody = "/images/sprites/"+this.state.skin+"/head"+this.state.head+"/baby-body.png"
		}

		var onClickEvent = !this.props.isSorted ? this.handleMouseDown.bind(this) : null

		console.log('render')

		return(			
			<div
			className={babyClasses}
			onMouseDown={onClickEvent}
			onMouseEnter={this.handleMouseEnter.bind(this, id)}
			onMouseLeave={this.handleMouseLeave.bind(this)}
			id={id}
			ref="itSelf">
				<DetailBaby
					color={this.getBabyColor(this.props.datas.tag)}
					babyDetail={this.props.datas}
					isDisplayedBabyDetail={this.state.isDisplayedBabyDetail} />
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
