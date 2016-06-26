import React from 'react'
import GSAP from 'gsap'
import qwest from 'qwest'

import IntroStep from './IntroStep'
import QuestionsStep from './QuestionsStep'
import FinalStep from './FinalStep'

export default class Form extends React.Component {
	constructor() {
		super()

		this.state = {
			step: 0,
			stepMax: 6,
			nextQuestionId: 0,
			previousQuestionsIds: [],
			currentQuestionId: 0,
			questions: [],
			answers:[]
		}
	}

	componentWillUpdate(nextProps, nextState) {
		// If props "form is displayed", show form
		if (nextProps.isDisplayed == true) {
			this.showForm()
		}

		if (nextState.nextQuestionId != this.state.nextQuestionId) {
			this.nextStep(nextState.nextQuestionId)
		}
	}

	componentWillMount() {
		// Add event listener
		window.addEventListener('keydown', this.handleKeyDown.bind(this))

		this.setState({
			"currentQuestion": this.state.questions[0]
		})

		this.loadQuestions()
	}

	handleKeyDown(e) {
		// ESC key 
		if (e.keyCode == 27 && this.props.isDisplayed) {
			this.hideForm();
		}
	}

	loadQuestions() {
        qwest
            .get("/json/questions.json")
            .then((xhr, response) => {
                this.setState({
                    questions: response.questions
                })
            });
    }

	hideForm() {
		var self = this;

		// Tween to hidden state + set props
		TweenMax.to(this.refs.form, .5, {
			opacity: 0,
			scale: .95,
			ease: Power2.easeOut,
			onComplete: function(){
				self.refs.form.className = 'form';
				setTimeout(function(){
					self.props.setFormIsDisplayedProps(false)
				}, 250)
			}
		})
	}

	showForm() {
		if (!this.props.isDisplayed) {
			var self = this;

			// Tween to displayed state, props already set
			TweenMax.to(this.refs.form, .5, {
				opacity: 1,
				scale: 1,
				ease: Power2.easeOut,
				onStart: function(){
					self.refs.form.className += ' displayed';
				}
			})
		}
	}

	nextStep(nextQuestionId) {
		if (this.state.step >= this.state.stepMax) {
			var newStep = this.state.step
		} else {
			var newStep = this.state.step + 1
		}

		// set new question to display
		if (newStep > 1) {
			var newCurrentQuestionId = nextQuestionId
		} else {
			var newCurrentQuestionId = this.state.currentQuestionId
		}

		// Update previous questions ids array
		var previousQuestionsIds = []
		previousQuestionsIds = this.state.previousQuestionsIds
		previousQuestionsIds = previousQuestionsIds.concat(this.state.currentQuestionId)

		this.setState({
			step: newStep,
			previousQuestionsIds: previousQuestionsIds,
			currentQuestionId: newCurrentQuestionId,
			currentQuestion: this.state.questions[newCurrentQuestionId]
		})
	}

	previousStep() {
		if (this.state.step <= 0) {
			var newStep = 0
		} else {
			var newStep = this.state.step - 1
		}

		// set new question to display
		if (newStep >= 1) {
			var newCurrentQuestionId = this.state.previousQuestionsIds[this.state.previousQuestionsIds.length - 1]
			// Update previous questions ids array
			var previousQuestionsIds = []
			previousQuestionsIds = this.state.previousQuestionsIds
			previousQuestionsIds = previousQuestionsIds.pop()

			// Unset last answer
			var answersArray = []
			answersArray = this.state.answers
			answersArray = answersArray.splice(answersArray.length - 2, answersArray.length)
		} else {
			var newCurrentQuestionId = this.state.currentQuestionId
			var previousQuestionsIds = []
			var answers = []
		}

		this.setState({
			step: newStep,
			answers: answersArray,
			previousQuestionsIds: previousQuestionsIds,
			currentQuestionId: newCurrentQuestionId,
			currentQuestion: this.state.questions[newCurrentQuestionId]
		})

		console.log(this.state.questions[newCurrentQuestionId])
	}

	setNextQuestionId(nextQuestionId) {
		this.setState({
			nextQuestionId: nextQuestionId
		})
	}

	saveAnswer(question, answer) {
		console.log(question)
		console.log(answer)

		var theAnswer = [question,answer]
		var answersArray = []
		answersArray = this.state.answers
		answersArray = answersArray.concat(theAnswer)

		this.setState({
			answers: answersArray
		})
	}

	resetForm() {
		this.setState({
			step: 0,
			currentQuestionId: 0,
			currentQuestion: this.state.questions[0]
		})
	}

	render() {
		var closeForm
		var button

		// Button close available only if form is displayed
		if (this.props.isDisplayed) {
			var closeForm = this.hideForm.bind(this);
			var buttonClose = <button className="form--close" onClick={closeForm}></button>
		}

		// Button previous availability
		if (this.state.step >= 1 && this.state.step <= 6) {
			var buttonPrevious = <button className="form--previous-step"onClick={this.previousStep.bind(this)}><span>Précédent</span></button>
		}

		// Set right section content
		if (this.state.step == 0) {
			var rightContent = <IntroStep 
									step={this.state.step}
									goToNextStep={this.nextStep.bind(this)}
									goToPreviousStep={this.previousStep.bind(this)}
									formIsDisplayed={this.props.isDisplayed}
									/>
		} else if (this.state.step >= 1 && this.state.step < 6) {
			var rightContent = <QuestionsStep
									step={this.state.step}
									goToNextStep={this.nextStep.bind(this)}
									goToPreviousStep={this.previousStep.bind(this)}
									formIsDisplayed={this.props.isDisplayed}
									currentQuestion={this.state.currentQuestion}
									setNextQuestionId={this.setNextQuestionId.bind(this)}
									saveAnswer={this.saveAnswer.bind(this)}
									/>   
		} else if (this.state.step == 6) {
			var rightContent = <FinalStep 
									step={this.state.step}
									questions={this.state.questions}
									hideForm={this.hideForm.bind(this)}
									resetForm={this.resetForm.bind(this)}
									/>
		}
		
		return(
			<section
				ref="form"
				className="form">
				<div className="form--container">
					<div className="form--container--left">
						<img className="gif-baby" src="/images/baby.gif" alt=""/>
					</div>
					<div className="form--container--right">
						{rightContent}
					</div>
				</div>

				{buttonClose}

				{buttonPrevious}
			</section>
		);
	}
}
