import React from 'react'
import qwest from "qwest"
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable'
import GSAP from 'gsap'

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
			rotateAngleLimit: 40,
		}
	}

    componentWillMount() {
    	this.setBabySpec()
    }

	componentDidMount() {
		this.setPosition(this.props.pos.origin)

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
		var babyRotation = this.rotateBaby(x, this.state.rotateAngleLimit),
			rotationExageration = 2

		this.refs.itSelf.style.transform = "rotate("+babyRotation+"deg)"

		this.setState({
			transform: this.refs.itSelf.style.transform,
			transformArms: "rotate("+babyRotation+"deg)"
		})

		// translate the element
		target.style.webkitTransform =
		target.style.transform =
		  'translate(' + (x) + 'px, ' + (y) + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	}

	onDragStop(event) {
		console.log("stop drag")

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
        			skin: "jaune.png"
        		})
        		break;
        	case "Développeur":
        		this.setState({
        			skin: "bleu.png"
        		})
        		break;
        	case "Chef de projet":
        		this.setState({
        			skin: "vert.png"
        		})
        		break;
        	case "Marketeux":
        		this.setState({
        			skin: "orange.png"
        		})
        		break;
        	default:
        		this.setState({
        			skin: "orange.png"
        		})
        }
	}



	handleMouseEnter(e, id) {

	}

	handleMouseLeave(e) {
		// this.getBabySkin(this.props.datas.tag)
		this.props.setDetailIsDisplayedProps(false)
	}

	handleMouseDown(e) {
		let babyDatas = this.props.datas
		this.props.setDetailIsDisplayedProps(true)
		this.props.setBabyDetail(babyDatas)
	}

	render() {
		const id = "baby-"+this.props.id

		var babyClasses = classNames({
			'baby': true,
			'hovered': this.state.isHovering,
			'neighbourg': this.state.isNeighbourg
		})

		var piecesClasses = classNames({
			'baby-pieces': true,
			'moving': this.state.isDragging
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

		return(
			<div
			className={babyClasses}
			onMouseDown={this.handleMouseDown.bind(this)}
			onMouseEnter={this.handleMouseEnter.bind(this, id)}
			onMouseLeave={this.handleMouseLeave.bind(this)}
			id={id}
			ref="itSelf">
				<div className="the-baby" style={{transform: this.state.transform}}>
					<span className={babyBgClasses} style={babyStyle}></span>
					<div className={piecesClasses}>
						<span className="baby-body"><img src={babyBody} alt="baby body"/></span>
						<span className="baby-arm-right" style={{transform: this.state.transformArms}}><img src="/images/right-arm.png" alt="baby right arm"/></span>
						<span className="baby-arm-left" style={{transform: this.state.transformArms}}><img src="/images/left-arm.png" alt="baby left arm"/></span>
						<span className="baby-leg-right" style={{transform: this.state.transformArms}}><img src="/images/right-leg.png" alt="baby right leg"/></span>
						<span className="baby-leg-left" style={{transform: this.state.transformArms}}><img src="/images/left-leg.png" alt="baby left leg"/></span>
					</div>
				</div>
			</div>
		);
	}
}
