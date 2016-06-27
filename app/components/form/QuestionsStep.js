import React from 'react'

import AnswerItem from './AnswerItem'

export default class QuestionsStep extends React.Component {
	constructor() {
		super()

		this.state = {
			keyPressedId: null
		}

		this.handleKeyUp = this.handleKeyUp.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.currentQuestion.id != this.props.currentQuestion.id) {
			var tl = new TimelineMax()
			tl.to(this.refs.sectionQuestions, 0, {
				scale: .5,
				ease: Power2.easeOut,
			})
			tl.to(this.refs.sectionQuestions, .3, {
				scale: 1,
				ease: Power2.easeOut,
			})
		}
	}

	componentWillMount() {
		window.addEventListener('keyup', this.handleKeyUp)
	}

	componentWillUnmount() {
		window.removeEventListener('keyup', this.handleKeyUp)
	}

	componentDidMount() {
		TweenMax.to(this.refs.sectionQuestions, .3, {
			scale: 1,
			ease: Power2.easeOut,
		})
	}

	handleKeyUp(e) {
		console.log("KeyUp")
		var self = this

		if (this.props.formIsDisplayed) {
			// Handle A/B/C/D/E keys
			switch(e.keyCode) {
				case 65:
					self.setState({
						keyPressedId: 0
					})
					break;
				case 66:
					self.setState({
						keyPressedId: 1
					})
					break;
				case 67:
					self.setState({
						keyPressedId: 2
					})
					break;
				case 68:
					self.setState({
						keyPressedId: 3
					})
					break;
				case 69:
					self.setState({
						keyPressedId: 4
					})
					break;
			}
		}
	}

	resetKeyPressedId() {
		this.setState({
			keyPressedId: null
		})	
	}

	render() {
		// get currentQuestion
		var currentQuestion = this.props.currentQuestion

		// Toggle btn
		var goToNextStep = this.props.goToNextStep.bind(this)

		// Set next question id
		var setNextQuestionId = this.props.setNextQuestionId.bind(this)

		// Save answer
		var saveAnswer = this.props.saveAnswer.bind(this)

		// Var question number 
		var questionNumber = this.props.step

		// key pressed id
		var keyPressedId = this.state.keyPressedId

		// reset key pressed id
		var resetKeyPressedId = this.resetKeyPressedId.bind(this)

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
									keyPressedId={keyPressedId}
									resetKeyPressedId={resetKeyPressedId}
									question={currentQuestion}
									goToNextStep={goToNextStep}
									setNextQuestionId={setNextQuestionId}
									saveAnswer={saveAnswer}/>
							})
						}
					</div>
				</div>
			</section>
		);
	}
}
