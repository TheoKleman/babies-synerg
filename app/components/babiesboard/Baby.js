import React from 'react'
import qwest from "qwest"
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable'
import GSAP from 'gsap'

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
		}
	}

    componentWillMount() {
    	this.setBabySpec()
    }

	componentDidMount() {
		this.setPosition(this.props.pos.origin)

		this.enableDrag(true)
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
	}

	onDragStop(event) {
		var babyContent = document.getElementById(event.target.id).firstChild
		babyContent.style.transform = "rotate(0deg)"

		this.setState({
			isDragging: false
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
		var babyRotation = this.rotateBabyOnSort(posDestination.Xpx, posOrigin.Xpx, this.state.rotateAngleLimit)

		TweenMax.set(this.refs.bodyImage, {
			display: 'none'
		})
		TweenMax.set(this.refs.babyPieces, {
			opacity: 1
		})
		TweenMax.allTo(
			[this.refs.armRight, this.refs.armLeft, this.refs.legRight, this.refs.legLeft],
			2,
		 {
			rotation: babyRotation,
			delay: 0.2,
			ease: Power1.easeOut,
		})
		TweenMax.allTo(
			[this.refs.armRight, this.refs.armLeft, this.refs.legRight, this.refs.legLeft],
			1.3,
		 {
			rotation: 0,
			delay: 3,
			ease: Elastic.easeOut.config(0.6, 0.3),
		})
	}

	onBabySortEnd() {
		
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
        	case "Designer":
        		this.setState({
        			skin: "bleu.png"
        		})
        		break;
        	case "Développeur":
        		this.setState({
        			skin: "orange.png"
        		})
        		break;
        	case "Chef de projet":
        		this.setState({
        			skin: "jaune.png"
        		})
        		break;
        	case "Marketeux":
        		this.setState({
        			skin: "vert.png"
        		})
        		break;
        	default:
        		this.setState({
        			skin: "jaune.png"
        		})
        }
	}

	getBabyColor(skill) {

        let babySKin = '';

        switch(skill) {
        	case "Designer":
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

	handleMouseEnter(e, id) {
		this.props.toggleBabyIsHovered(true)
	}

	handleMouseLeave(e) {
		this.props.toggleBabyIsHovered(false)
		this.setState({
			isDisplayedBabyDetail: false
		})
	}

	handleMouseDown(e) {
		let babyDatas = this.props.datas		
		this.setState({
			isDisplayedBabyDetail: true
		})
	}

	render() {

		const id = "baby-"+this.props.id

		var babyClasses = classNames({
			'baby': true,
			'hovered': this.state.isHovering,
			'neighbourg': this.state.isNeighbourg,
			'disabled': this.props.isSorted
		})

		var piecesClasses = classNames({
			'baby-pieces': true,
			'moving': this.state.isDragging,
		})

		var babyBgClasses = classNames({
			'baby-bg': true,
			'moving': this.state.isDragging
		})

		var babyStyle = {
			backgroundImage: "url(/images/"+this.state.skin+")",
			backgroundSize: "cover"
		}

		var babyBody = "/images/body-"+this.state.skin

		var onClickEvent = !this.props.isSorted ? this.handleMouseDown.bind(this) : null

		return(			
			<div
			className={babyClasses}
			onMouseDown={onClickEvent}
			// onMouseEnter={this.handleMouseEnter.bind(this, id)}
			onMouseLeave={this.handleMouseLeave.bind(this)}
			id={id}
			ref="itSelf">
				<DetailBaby
					color={this.getBabyColor(this.props.datas.tag)}
					babyDetail={this.props.datas}
					isDisplayedBabyDetail={this.state.isDisplayedBabyDetail} />
				<div className="the-baby" style={{transform: this.state.transform}}>
					<span ref="bodyImage" className={babyBgClasses} style={babyStyle}></span>
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
