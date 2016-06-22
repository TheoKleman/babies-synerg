import React from 'react'
import qwest from "qwest"
import ReactDOM from 'react-dom'
import Draggable from 'react-draggable';
import GSAP from 'gsap'

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
			deltaPosition: { x: 0, y: 0 }
		}
	}

    componentWillMount() {
    	this.setBabySpec()
    }

	componentDidMount() {
		this.setPosition(this.props.pos.origin)
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
		console.log(e)
	}

	handleDrag(e, ui) {
		const {x, y} = this.state.deltaPosition;
		let rotationAngle = this.getRotationAngle(ui.deltaX)
		let rotationExageration = 3;
		let translateLeft = this.props.pos.origin.Xpx
		let translateTop = this.props.pos.origin.Ypx

		console.log(rotationAngle)

		if(rotationAngle < 120) 
			this.refs.itSelf.style.transform = "rotate("+(rotationAngle * rotationExageration)+"deg)"

		this.setState({
			deltaPosition: {
				x: x + ui.deltaX,
				y: y + ui.deltaY,
			},
			transform: this.refs.itSelf.style.transform,
		})

    	console.log(this.refs.itSelf.style.transform)

      // console.log("X: "+this.state.deltaPosition.x)
      // console.log("Y: "+this.state.deltaPosition.y)

      	// TweenMax.set(this.refs.itSelf, {
       //      rotation: this.getRotationAngle(ui.deltaX),
       //      ease: Power0.linear,
       //  })

       
    }

    onStart() {
      this.setState({activeDrags: ++this.state.activeDrags});
      console.log('starting drag')
    }

    onStop(e, ui) {
      this.setState({activeDrags: --this.state.activeDrags});
      console.log('stop drag')
      
      let newX = ui.x
      let newY = ui.y
      
      // We update "pos" props value only when we stop dragging
      this.props.pos.origin.Xpx = newX
      this.props.pos.origin.Ypx = newY
      this.props.pos.rotation = 0
    }

    updateMatrix(angle, ui) {
    	let doubleAngle = angle*2
    	this.props.pos.rotation = angle

    	// if(angle > 0) {
    	// 	this.refs.itSelf.style.transform = "matrix("+Math.cos(doubleAngle)+","+Math.sin(doubleAngle)+","+(Math.abs(Math.sin(doubleAngle)) * -1)+","+Math.cos(doubleAngle)+", "+ui.x+", "+ui.y+")"	
    	// } else {
    	// 	this.refs.itSelf.style.transform = "matrix("+Math.cos(angle)+","+Math.sin(doubleAngle)+","+Math.sin(doubleAngle)+","+Math.cos(angle)+", "+ui.x+", "+ui.y+")"
    	// }
    	// this.refs.itSelf.style.transform = "rotate("+angle+"deg) translateX("+ui.x+"px) translateY("+ui.y+"px)"
    }

    getRotationAngle(direction) {
    	
    	var test = direction % 2

    	if(direction < 0) {
    		var rotateAngle = "-"+ (test * direction)	
    	} else {
    		var rotateAngle = (test * direction)
    	}

    	return rotateAngle
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

		const {deltaPosition} = this.state
		return(
			<Draggable
				axis="both"
		        handle=".baby"
		        defaultPosition={{x: this.props.pos.origin.Xpx, y: this.props.pos.origin.Ypx}}
		        position={null}
		        zIndex={100}
		        bounds="parent"
		        onDrag={this.handleDrag.bind(this)}
		        onStart={this.onStart.bind(this)}
		        onStop={this.onStop.bind(this)}>

				<div
				className={babyClasses}
				onMouseDown={this.handleMouseDown.bind(this)}
				onMouseEnter={this.handleMouseEnter.bind(this, id)}
				onMouseLeave={this.handleMouseLeave.bind(this)}
				id={id}
				ref="itSelf">
					<div className="the-baby" style={{transform: this.state.transform}}>	
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
			</Draggable>
		);
	}
}
