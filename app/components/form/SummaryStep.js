import React from 'react'

export default class SummaryStep extends React.Component {
	constructor() {
		super()

		this.state = {
			isSelected: false,
			isHovered: false
		}

		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)

		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseUp = this.handleMouseUp.bind(this)
	}

	componentDidMount() {
		// animation
		window.addEventListener("keydown", this.handleKeyDown)
		window.addEventListener("keyup", this.handleKeyUp)
		this.refs.spacebar.addEventListener('mouseenter', this.handleMouseEnter)
		this.refs.spacebar.addEventListener('mouseleave', this.handleMouseLeave)
		this.refs.spacebar.addEventListener('mousedown', this.handleMouseDown)
		this.refs.spacebar.addEventListener('mouseup', this.handleMouseUp)
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown)
		window.removeEventListener("keyup", this.handleKeyUp)
		this.refs.spacebar.removeEventListener('mouseenter', this.handleMouseEnter)
		this.refs.spacebar.removeEventListener('mouseleave', this.handleMouseLeave)
		this.refs.spacebar.removeEventListener('mousedown', this.handleMouseDown)
		this.refs.spacebar.removeEventListener('mouseup', this.handleMouseUp)
	}

	handleMouseEnter() {
		this.setState({
			isHovered: true
		})
	}

	handleMouseLeave() {
		this.setState({
			isHovered: false,
			isSelected: false
		})  
	}

	handleMouseDown() {
		this.setState({
			isSelected: true,
		})
	}

	handleMouseUp() {
		this.setState({
			isSelected: false,
		})
		if (this.state.isHovered) {
			this.props.goToNextStep()
		}
	}

	handleKeyDown(e) {
		if (e.keyCode == 32) {
			this.setState({
				isSelected: true
			})
		}
	}

	handleKeyUp(e) {
		if (e.keyCode == 32) {
			this.setState({
				isSelected: false
			})
			this.props.goToNextStep()
		}	
	}

	render() {
		var designers = this.props.availablePeopleBySkills.designers
		if (designers > 0) {
			var designersText = <li>{designers}<small>créatifs</small></li>
		}
		var developers = this.props.availablePeopleBySkills.developers
		if (developers > 0) {
			var developersText = <li>{developers}<small>developpeurs</small></li>
		}
		var market = this.props.availablePeopleBySkills.market
		if (market > 0) {
			var marketText = <li>{market}<small>marketeux</small></li>
		}
		var management = this.props.availablePeopleBySkills.management
		if (management > 0) {
			var managementText = <li>{management}<small>chefs de projet</small></li>
		}
		var total =  designers + developers + market + management

		// Class selected
		var buttonClass = "key spacebar"
		if (this.state.isSelected) {
			buttonClass += " selected"
		}

		return(
			<section className="right--summary" ref="sectionSummary">
				<div className="content-centered">
					<span>
						{total}
						<small>
							etudiants sont a meme de travailler sur votre projet !
						</small>
					</span>
					<ul>
						{designersText}
						{developersText}
						{marketText}
						{managementText}
					</ul>

					<button
						ref="spacebar"
						className={buttonClass}
						>
						<span className="key--content">Prendre contact avec Synerg'Hetic</span>
						<span className="key--double"></span>
					</button>
				</div>
			</section>
		);
	}
}
