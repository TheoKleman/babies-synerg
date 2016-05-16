import React from 'react'
var classNames = require('classnames')

export default class Baby extends React.Component {
	constructor() {
		super()

		this.state = {
			maxW: 3000,
			maxH: 1666,
			babyWidth: 200,
			babyHeight: 200,
			style: {
				top: "0px",
				left: "0px",
				zIndex: 0
			},
			isHovering: false,
			iNeighbourg: false
		}
	}

	componentDidMount() {
		this.setPosition();
	}

	// Position Top can be a number between 0 and Board size - baby height
	// Position Left can be a number between 0 and Board size - baby width
	setPosition() {
		var distanceTop = Math.floor(Math.random() * (this.state.maxH - this.state.babyHeight)) + 1
		var distanceLeft = Math.floor(Math.random() * (this.state.maxW - this.state.babyWidth)) + 1
		var test = 0
		var baby = {
			id: this.props.id,
			x: distanceLeft,
			y: distanceTop
		}

		switch(true) {
			case (distanceTop < 100):
				test = 1
				break;
			case (distanceTop < 200):
				test = 2
				break;
			case (distanceTop < 300):
				test = 3
				break;
			case (distanceTop < 400):
				test = 4
				break;
			case (distanceTop < 500):
				test = 5
				break;
			case (distanceTop < 600):
				test = 6
				break;
			case (distanceTop < 700):
				test = 7
				break;
			case (distanceTop < 800):
				test = 8
				break;
			case (distanceTop < 900):
				test = 9
				break;
			case (distanceTop < 1000):
				test = 10
				break;
			case (distanceTop < 1100):
				test = 11
				break;
			case (distanceTop < 1200):
				test = 12
				break;
			case (distanceTop < 1300):
				test = 13
				break;
			case (distanceTop < 1400):
				test = 14
				break;
			case (distanceTop < 1500):
				test = 15
				break;
			case (distanceTop < 1600):
				test = 16
				break;
		}

		this.setState({
			style: {
				top:  distanceTop+"px",
				left: distanceLeft+"px",
				zIndex: test
			}
		})

		this.props.pushBabies(baby)
	}

	handleMouseEnter(e) {
		// console.log('entering')
		this.setState({isHovering: true})
	
		let babyHovered = this.getBabyPosition(this.props.id) 

		// Check if babies are around
		var babiesToMoove = this.getBabiesNear(babyHovered.x, babyHovered.y)

		console.log(babiesToMoove)
		
		babiesToMoove.map( elem => {
			console.log(elem)
		} )
	}

	handleMouseLeave(e) {
		// console.log('leaving')

		this.setState({isHovering: false})
	}

	getBabyPosition(id) {
		return this.props.babiesPos[id + 1]
	}

	getBabiesNear(posX, posY) {
		var emptyArray = []

		var xMin = posX - this.state.babyWidth
		var xMax = posX + this.state.babyWidth
		var yMin = posY - this.state.babyHeight
		var yMax = posY + this.state.babyHeight

		this.props.babiesPos.map( elem => {
			if(xMin < elem.x && elem.x < xMax && yMin < elem.y && elem.y < yMax) {
				emptyArray.push({id: elem.id, x: elem.x, y: elem.y})	
			}
		})

		return emptyArray
	}

	render() {
		const name = this.props.datas.nickname
		const profile = this.props.datas.tag
		const yearSpent = this.props.datas.year

		var babyClasses = classNames({
			'baby': true,
			'hover': this.state.isHovering,
			'neighbourg': this.state.isNeighbourg
		})

		return(
			<div 
				className={babyClasses}
				style={this.state.style}
				onMouseEnter={this.handleMouseEnter.bind(this)}
				onMouseLeave={this.handleMouseLeave.bind(this)}
				ref="baby">
				<div className="wrapper">
					<span>Name: {name}</span>
					<br/>
					<span>Skills: {profile}</span>
					<br/>
					<span>CurrentYear: {yearSpent}</span>
					<br/>
				</div>
			</div>
		);
	}
}
