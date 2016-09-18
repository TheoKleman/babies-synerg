import React from 'react'

import AnswerItem from './AnswerItem'

export default class QuestionsStep extends React.Component {
	constructor() {
		super()

		this.state = {
			keyDownId: null,
			keyUpId: null,
			isSelected: false,
		}

		this.handleKeyDown = this.handleKeyDown.bind(this)
		this.handleKeyUp = this.handleKeyUp.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentQuestion.id != this.props.currentQuestion.id) {
			// set gif
			this.props.setQuestionGif(nextProps.currentQuestion.gif)
		}
	}

	componentWillMount() {
		window.addEventListener('keydown', this.handleKeyDown)
		window.addEventListener('keyup', this.handleKeyUp)
	}

	componentWillUnmount() {
		window.removeEventListener('keydown', this.handleKeyDown)
		window.removeEventListener('keyup', this.handleKeyUp)
	}

	handleKeyDown(e) {
		var self = this

		this.setState({
			isSelected: true
		})
		// Handle A/B/C/D/E keys
		switch(e.keyCode) {
			case 65:
				self.setState({
					keyDownId: 0
				})
				break;
			case 66:
				self.setState({
					keyDownId: 1
				})
				break;
			case 67:
				self.setState({
					keyDownId: 2
				})
				break;
			case 68:
				self.setState({
					keyDownId: 3
				})
				break;
			case 69:
				self.setState({
					keyDownId: 4
				})
				break;
		}
	}

	handleKeyUp(e) {
		var self = this
		this.setState({
			isSelected: false
		})
		// Handle A/B/C/D/E keys
		switch(e.keyCode) {
			case 65:
				self.setState({
					keyUpId: 0
				})
				break;
			case 66:
				self.setState({
					keyUpId: 1
				})
				break;
			case 67:
				self.setState({
					keyUpId: 2
				})
				break;
			case 68:
				self.setState({
					keyUpId: 3
				})
				break;
			case 69:
				self.setState({
					keyUpId: 4
				})
				break;
		}
	}

	resetKeyId() {
		this.setState({
			keyDownId: null,
			keyUpId: null
		})
	}

	render() {
		// get currentQuestion
		var currentQuestion = this.props.currentQuestion

		// Save answer
		var saveAnswer = this.props.saveAnswer.bind(this)

		// Var question number
		var questionNumber = this.props.previousQuestionsIds.length + 1

		// key down id
		var keyDownId = this.state.keyDownId

		// key pressed id
		var keyUpId = this.state.keyUpId

		// reset key pressed id
		var resetKeyId = this.resetKeyId.bind(this)

		// is selected
		var isSelected = this.state.isSelected

		return(
			<section className="right--questions" ref="sectionQuestions">
				<div className="content-centered">
					<span className="question">
						<small>Question {questionNumber} / 5</small>
						<br />
						{currentQuestion.text}
					</span>
					<div className="form--answers">
						{
							currentQuestion.answers.map(function(answer, i){
								return <AnswerItem
									key={answer.id}
									answer={answer}
									keyDownId={keyDownId}
									keyUpId={keyUpId}
									isSelected={isSelected}
									resetKeyId={resetKeyId}
									question={currentQuestion}
									saveAnswer={saveAnswer}/>
							})
						}
					</div>
				</div>
			</section>
		);
	}
}
