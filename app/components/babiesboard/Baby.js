import React from 'react'

export default class Baby extends React.Component {
	constructor() {
		super()

		this.state = {
			maxW: 3000,
			maxH: 1666,
			babyWidth: 150,
			babyHeight: 150,
			style: {
				top: "0px",
				left: "0px",
				zIndex: 0
			}
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

		// if(distanceTop < 100) {
		// 	test = 24
		// } else if(distanceTop < 200) {
		// 	test = 38
		// }

		this.setState({
			style: {
				top:  distanceTop+"px",
				left: distanceLeft+"px",
				zIndex: test
			}
		})
	}

	render() {
		const name = this.props.datas.nickname
		const profile = this.props.datas.tag
		const yearSpent = this.props.datas.year

		return(
			<div className="baby" style={this.state.style}>
				<span>Name: {name}</span>
				<p>Profile: {profile}</p>
				<span>Temps a Hétic: {yearSpent}</span>
				<span>z-index: {this.state.style.zIndex}</span>
			</div>
		);
	}
}
