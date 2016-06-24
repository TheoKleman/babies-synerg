import React from 'react'

var classNames = require('classnames')

export default class AnswerItem extends React.Component {
	constructor() {
		super()

		this.state = {
			isClicked: false,
		}
	}

	componentDidMount() {
		this.setState({
			isClicked: false
		})
	}

	handleAnswer() {
		var that = this

		this.setState({
			isClicked: true
		})

		setTimeout(function() {
			that.props.setNextQuestionId(that.props.answer.nextQuestionId)
		}, 300)
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

		var answerClasses = classNames({
			'key': true,
			'selected': this.state.isClicked,
		})

		return(
			<div
				className="form--answers--item"
				ref={this.props.answer.id}
				onClick={this.handleAnswer.bind(this)}
				>
				<button 
					ref="itSelf"
					className={answerClasses}>
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
