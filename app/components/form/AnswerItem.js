import React from 'react'

var classNames = require('classnames')

export default class AnswerItem extends React.Component {
	constructor() {
		super()
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.keyPressedId === this.props.answer.id) {
			this.props.resetKeyPressedId()
			this.props.goToNextStep(this.props.answer.nextQuestionId)
			this.props.saveAnswer(this.props.question.text, this.props.answer.text, this.props.answer.sentence)
		}
	}

	handleAnswer() {
		this.props.goToNextStep(this.props.answer.nextQuestionId)
		this.props.saveAnswer(this.props.question.text, this.props.answer.text, this.props.answer.sentence)
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

		var id = "question"+this.props.question.id+"-answer"+this.props.answer.id

		return(
			<div
				className="form--answers--item"
				ref={this.props.answer.id}
				onClick={this.handleAnswer.bind(this)}
				id={id}
				>
				<button 
					ref="itSelf"
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
