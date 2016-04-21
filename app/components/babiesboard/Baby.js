import React from 'react'

export default class Baby extends React.Component {
	constructor(props) {
		super()

		this.state = {
			maxW: 3000,
			maxH: 1666,
			babyWidth: 150,
			babyHeight: 150,
			style: {
				top: "0px",
				left: "0px"
			}
		}
	}

	componentDidMount() {

		this.setPosition();

	}

	// Position Top can be a number between 0 and Board size - baby height
	// Position Left can be a number between 0 and Board size - baby width

	setPosition() {
		this.setState({
			style: {
				top:  (Math.floor(Math.random() * (this.state.maxH - this.state.babyHeight)) + 1)+"px",
				left: (Math.floor(Math.random() * (this.state.maxW - this.state.babyWidth)) + 1)+"px"
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
			</div>
		);
	}
}