import React from "react"
import Baby from "./Baby"

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
			],
			savePosX: [0],
			savePosY: [0]
		}

	}

	pushBabies(baby) {

		var newArray = this.state.babiesPos
		var tempArray = newArray
		
		newArray = newArray.push(baby)

		this.setState({
			babiesPos: tempArray
		})

	}

	pushPositionsX(pos) {
		var newArray = this.state.savePosX
		var tempArray = newArray

		newArray = newArray.push(pos)

		this.setState({
			savePosX: tempArray
		})
	}
	pushPositionsY(pos) {
		var newArray = this.state.savePosY
		var tempArray = newArray

		newArray = newArray.push(pos)

		this.setState({
			savePosY: tempArray
		})
	}

	render() {

		return(
			<div className="babies-container" >
				{
					this.props.babies.map(function(baby, i) {
							return(
								<Baby key={i} 
											datas={baby} 
											pushBabies={this.pushBabies.bind(this)}
											pushPositionsX={this.pushPositionsX.bind(this)}
											pushPositionsY={this.pushPositionsY.bind(this)}
											id={i} 
											babiesPos={this.state.babiesPos}
											posX={this.state.savePosX}
											posY={this.state.savePosY} />
							);
						}
					, this)
				}
			</div>
		);
	}

}