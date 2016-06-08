import React from 'react'
import qwest from "qwest"
import ReactDOM from 'react-dom'
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
				zIndex: 0
			},
			isHovering: false,
			iNeighbourg: false,
			savedTop: 0,
			savedLeft: 0
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
				zIndex: response.style.zIndex
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
	        y: pos.Ypx +"px",
	        zIndex: pos.y
	      }
	    )

	}

	getRandomNumber(limitInf, limitSup) {	
		return Math.floor(Math.random() * (limitSup-limitInf+1)+limitInf)
	}

	handleMouseEnter(e) {
		this.setState({isHovering: true})
	
		// let babyHovered = this.getBabyPosition(this.props.id) 
	}

	handleMouseLeave(e) {

		this.setState({isHovering: false})
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
				onMouseEnter={this.handleMouseEnter.bind(this)}
				onMouseLeave={this.handleMouseLeave.bind(this)}
				id={id}
				ref="itSelf">
				<div className="the-baby" >	
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
