import React from 'react'

export default class AnswerItem extends React.Component {
	constructor() {
		super()
	}

	handleAnswer() {
		this.props.setLastAnswer(this.props.answer)
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
		}

		return(
			<div
				className="form--answers--item"
				ref={this.props.answer.id}
				onClick={this.handleAnswer.bind(this)}
				>
				<button className="key">
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
