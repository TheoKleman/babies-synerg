import React from "react"
import Baby from "./Baby"

export default class BabiesList extends React.Component {

	constructor() {
		super()
	}

	render() {

		return(
			<div className="babies-container">
				{
					this.props.babies.map(function(baby, i) {
							return(
								<Baby key={i} datas={baby} />
							);
						}
					)
				}
			</div>
		);
	}

}