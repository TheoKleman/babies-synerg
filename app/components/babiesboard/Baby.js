import React from 'react'

export default class Baby extends React.Component {
	constructor(props) {
		super()

		this.state = {
			maxW: 3000,
			maxH: 1666
		}
	}

	setPosition() {
		
	}

	render() {
		const name = this.props.datas.nickname
		const profile = this.props.datas.tag
		const yearSpent = this.props.datas.year

		return(
			<div className="baby">
				<span>Name: {name}</span>
				<p>Profile: {profile}</p>
				<span>Temps a Hétic: {yearSpent}</span>
			</div>
		);
	}
}
