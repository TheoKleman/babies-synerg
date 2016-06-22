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
			test: 100
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
				elementRect: { top: 0, left: 0, bottom: 0, right: 0 }
			},
			onmove: this.onDragListener
		})
	}

	onDragListener(event) {
		// console.log(event)

		// console.log(this.props.pos.origin.Xpx)

		// var currentBaby = document.getElementById(event.target.id)

		var boardWidth = document.getElementById('babies-board').clientWidth,
			boardHeight = document.getElementById('babies-board').clientHeight,
			viewportWidth = window.innerWidth,
			viewportHeight = window.innerHeight

		console.log(boardWidth)

		var target = event.target,
		    // keep the dragged position in the data-x/data-y attributes
		    x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
		    y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

		// translate the element
		target.style.webkitTransform =
		target.style.transform =
		  'translate(' + (event.clientX + (800)) + 'px, ' + (event.clientY + (500)) + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
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
			savedLeft: response.savedLeft
        })
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

	getRandomNumber(limitInf, limitSup) {	
		return Math.floor(Math.random() * (limitSup-limitInf+1)+limitInf)
	}

	handleMouseEnter(e, id) {
		this.setState({isHovering: true})
	
		// Save datas here for the future
		let babyXpx = this.props.pos.origin.Xpx
		let babyYpx = this.props.pos.origin.Ypx
		let babyDatas = this.props.datas

		// let babyHovered = this.getBabyPosition(this.props.id) 
	}

	handleMouseLeave(e) {
		this.setState({isHovering: false})
	}

	handleMouseDown(e) {
		
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

		return(
			<div
			className={babyClasses}
			onMouseDown={this.handleMouseDown.bind(this)}
			onMouseEnter={this.handleMouseEnter.bind(this, id)}
			onMouseLeave={this.handleMouseLeave.bind(this)}
			id={id}
			ref="itSelf">
				<div className="the-baby">	
					<span className="baby-bg"></span>
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
