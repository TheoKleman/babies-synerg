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
		}
	}

    componentWillMount() {
    	this.setBabySpec()
    }

	componentDidMount() {
		this.setPosition(this.props.pos.origin)

		// interact.on('drag', this.refs.itSelf, this.dragListener)
		interact(this.refs.itSelf).draggable({
			inertia: {
				resistance: 10,
				minSpeed: 200,
				endSpeed: 100,
				smoothEndDuration: 100
			},
			restrict: {
				restriction: 'parent',
				elementRect: { top: 0, left: 0, bottom: 1.5, right: 1.5 }
			},
			onmove: this.onDragListener.bind(this),
			onend: this.onDragStop.bind(this),
		})
	}

	onDragListener(event) {
		// console.log(event)

		console.log('mooving')

		this.setState({
			isDragging: true
		})

		var baseX = this.props.pos.origin.Xpx,
			baseY = this.props.pos.origin.Ypx - 40

		// var currentBaby = document.getElementById(event.target.id)

		var boardWidth = document.getElementById('babies-board').clientWidth,
			boardHeight = document.getElementById('babies-board').clientHeight,
			viewportWidth = window.innerWidth,
			viewportHeight = window.innerHeight

		var target = event.target,
		    // keep the dragged position in the data-x/data-y attributes
		    x = (parseFloat(target.getAttribute('data-x')) || baseX) + event.dx,
		    y = (parseFloat(target.getAttribute('data-y')) || baseY) + event.dy;


		// Rotate baby here
		var babyRotation = this.rotateBaby(x),
			rotationExageration = 2

			console.log(babyRotation)

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

		/*
		var target = event.target,
		    // keep the dragged position in the data-x/data-y attributes
		    x = (parseFloat(target.getAttribute('data-x')) || baseX) + event.dx,
		    y = (parseFloat(target.getAttribute('data-y')) || baseY) + event.dy;

		// translate the element
		target.style.webkitTransform =
		target.style.transform =
		  'translate(' + (x) + 'px, ' + (y) + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
		*/
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

	getRotationAngle(direction) {
		
		// var test = direction % 2
		
		// if(direction < 0) {
		// 	var rotateAngle = "-" + (test * direction) / 100	
		// } else {
		// 	var rotateAngle = (test * direction) / 100
		// }
		
		return direction
	}

	rotateBaby(direction) {
		var angle = 0

		if(direction > this.state.savedX) {
			angle = direction - this.state.savedX
			this.state.savedX = direction
			if(angle > 70) {
				angle = 70
				return angle
			} else {
				return angle
			}
		} else {
			angle = direction - this.state.savedX
			this.state.savedX = direction

			return angle
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
        			skin: "baby-placeholder.png"
        		})
        }
	}

	getRandomNumber(limitInf, limitSup) {	
		return Math.floor(Math.random() * (limitSup-limitInf+1)+limitInf)
	}

	handleMouseEnter(e, id) {
		this.setState({isHovering: true})
	
		// Save datas here for the future
		let babyXpx = this.props.pos.origin.Xpx
		let babyYpx = this.props.pos.origin.Ypx
		let babyDatas = this.props.datas

		this.props.setDetailIsDisplayedProps(true)
		this.props.setBabyDetail(babyDatas)

		// this.setState({
		// 	isHovering: true
		// })
		// this.setState({
		// 	skin: "baby.gif"
		// })
	}

	handleMouseLeave(e) {
		// this.getBabySkin(this.props.datas.tag)
		this.props.setDetailIsDisplayedProps(false)
		// this.setState({
		// 	isHovering: false
		// })
	}

	handleMouseDown(e) {

	}

	handleMouseUp(e) {
		console.log('mouse up')
		// this.setState({
		// 	updateAngle: false
		// })
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
			// onMouseUp={this.handleMouseUp.bind(this)}
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
					</div>
				</div>
			</div>
		);
	}
}
