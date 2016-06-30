import React from 'react'

var classNames = require('classnames')

export default class AnswerItem extends React.Component {
	constructor() {
		super()

		this.state = {
			isSelected: false,
			isHovered: false
		}

		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseUp = this.handleMouseUp.bind(this)
	}

	componentDidMount() {
		this.refs.itSelf.addEventListener('mouseenter', this.handleMouseEnter)
		this.refs.itSelf.addEventListener('mouseleave', this.handleMouseLeave)
		this.refs.itSelf.addEventListener('mousedown', this.handleMouseDown)
		this.refs.itSelf.addEventListener('mouseup', this.handleMouseUp)
	}

	componentWillUnmount() {
		this.refs.itSelf.removeEventListener('mouseenter', this.handleMouseEnter)
		this.refs.itSelf.removeEventListener('mouseleave', this.handleMouseLeave)
		this.refs.itSelf.removeEventListener('mousedown', this.handleMouseDown)
		this.refs.itSelf.removeEventListener('mouseup', this.handleMouseUp)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.keyUpId === this.props.answer.id) {
			this.props.resetKeyId()
			this.props.goToNextStep(this.props.answer.nextQuestionId)
			this.props.saveAnswer(this.props.question.text, this.props.answer.text, this.props.answer.sentence, this.props.answer.babies)
		}
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
			this.handleAnswer()
		}
	}

	handleAnswer() {
		this.props.goToNextStep(this.props.answer.nextQuestionId)
		this.props.saveAnswer(this.props.question.text, this.props.answer.text, this.props.answer.sentence, this.props.answer.babies)
	}

	render() {
		var char = ""
		switch(this.props.answer.id) {
			case 0:
				char = "A"
				break;
			case 1:
				char = "B"
				break;
			case 2:
				char = "C"
				break;
			case 3:
				char = "D"
				break;
			case 4:
				char = "E"
				break;
		}

		// Class selected
		var buttonClass = "form--answers--item"
		if ((this.props.isSelected
			&& this.props.keyDownId == this.props.answer.id)
			|| this.state.isSelected) {			
			buttonClass += " selected"
		}

		// Analytics shit
		var id = "question"+this.props.question.id+"-answer"+this.props.answer.id

		return(
			<div
				className={buttonClass}
				ref="itSelf"
				id={id} >
				<button 
					ref="itSelf-button"
					className="key">
					<span className="key--content">{char}</span>
					<span className="key--double"></span>
				</button>
				<div className="item--answer">
					<p>{this.props.answer.text}</p>
				</div>
			</div>
		);
	}
}
