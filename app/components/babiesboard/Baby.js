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
				endOnly: true,
				elementRect: { top: 0, left: 0, bottom: 1.5, right: 1.5 }
			},
			onmove: this.onDragListener.bind(this),
			onend: this.onDragStop.bind(this),
		})
	}

	onDragListener(event) {
		// console.log(event)

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

		var babyRotation = this.rotateBaby(x),
			rotationExageration = 2

		// console.log(babyRotation)
		this.refs.itSelf.style.transform = "rotate("+(babyRotation * rotationExageration)+"deg)"

		this.setState({
			transform: this.refs.itSelf.style.transform,
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
		// event.target..style.transform = "rotate(0deg)"

		var babyContent = document.getElementById(event.target.id).firstChild
		babyContent.style.transform = "rotate(0deg)"

		// var target = event.target,
		//     // keep the dragged position in the data-x/data-y attributes
		//     x = (parseFloat(target.getAttribute('data-x')) || baseX) + event.dx,
		//     y = (parseFloat(target.getAttribute('data-y')) || baseY) + event.dy;

		// // translate the element
		// target.style.webkitTransform =
		// target.style.transform =
		//   'translate(' + (x) + 'px, ' + (y) + 'px)';

		// // update the posiion attributes
		// target.setAttribute('data-x', x);
		// target.setAttribute('data-y', y);
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
		
		var test = direction % 2
		
		if(direction < 0) {
			var rotateAngle = "-"+ (test * direction / 90)	
		} else {
			var rotateAngle = (test * direction / 90)
		}
		
		return rotateAngle
	}

	rotateBaby(direction) {
		var angle = 0

		if(direction > this.state.savedX) {
			angle = this.getRotationAngle(direction)
			this.state.savedX = direction
			return angle
		} else {
			angle = this.getRotationAngle(-direction)
			this.state.savedX = direction

			return angle
		}
	}

	getBabySkin(skill) {

        let babySKin = '';

        switch(skill) {
        	case "Designer":
        		this.setState({
        			skin: "Jaune.png"
        		})
        		break;
        	case "Développeur":
        		this.setState({
        			skin: "Bleu.png"
        		})
        		break;
        	case "Chef de projet":
        		this.setState({
        			skin: "Vert.png"
        		})
        		break;
        	case "Marketeux":
        		this.setState({
        			skin: "Orange.png"
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

		// this.setState({
		// 	skin: "baby.gif"
		// })
	}

	handleMouseLeave(e) {
		// this.getBabySkin(this.props.datas.tag)
		this.props.setDetailIsDisplayedProps(false)
	}

	handleMouseDown(e) {
		this.props.setDetailIsDisplayedProps(true)
	}

	render() {
		const name = this.props.datas.nickname
		const profile = this.props.datas.tag
		const yearSpent = this.props.datas.year
		const id = "baby-"+this.props.id

		var babyClasses = classNames({
			'baby': true,
			'hover': this.state.isHovering,
			'neighbourg': this.state.isNeighbourg
		})

		var babyStyle = {
			backgroundImage: "url(/images/"+this.state.skin+")",
			backgroundSize: "cover"
		}

		return(
			<div
			className={babyClasses}
			onMouseDown={this.handleMouseDown.bind(this)}
			onMouseEnter={this.handleMouseEnter.bind(this, id)}
			onMouseLeave={this.handleMouseLeave.bind(this)}
			id={id}
			ref="itSelf">
				<div className="the-baby" style={{transform: this.state.transform}}>
					<span className="baby-bg" style={babyStyle}></span>
					<div className="wrapper">
						<span>Name: {name}</span>
						<br/>
						<span>Skills: {profile}</span>
						<br/>
						<span>CurrentYear: {yearSpent}</span>
						<br/>
					</div>
				</div>
			</div>
		);
	}
}
