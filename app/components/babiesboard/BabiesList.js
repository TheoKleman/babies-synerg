import React from "react"
import Baby from "./Baby"

var update = require('react-addons-update');

export default class BabiesList extends React.Component {

	constructor() {
		super()

		this.state = {
			babiesPos: [
			    {
			        id: null,
			        x: null,
			        y: null
			    }
			]
		}

	}

	pushBabies(baby) {

		var newArray = this.state.babiesPos
		var tamerArray = newArray
		
		newArray = newArray.push(baby)

		this.setState({
			babiesPos: tamerArray
		})

	}

	render() {

		return(
			<div className="babies-container" >
				{
					this.props.babies.map(function(baby, i) {
							return(
								<Baby key={i} datas={baby} pushBabies={this.pushBabies.bind(this)} id={i} />
							);
						}
					, this)
				}
			</div>
		);
	}

}