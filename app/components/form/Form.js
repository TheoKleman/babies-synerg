import React from 'react'
import GSAP from 'gsap'
import qwest from 'qwest'

import IntroStep from './IntroStep'
import QuestionsStep from './QuestionsStep'
import SummaryStep from './SummaryStep'
import MailStep from './MailStep'
import ThanksStep from './ThanksStep'

export default class Form extends React.Component {
	constructor() {
		super()

		this.state = {
			step: -1,
			questionGif: "",
			previousQuestionsIds: [],
			currentQuestion: {},
			currentQuestionId: 0,
			questions: [],
			answers:[],
			availablePeopleBySkills: {
				designers: 0,
				developers: 0,
				market: 0,
				management: 0,
			},
			isCloseHovered: false
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextProps.isDisplayed != this.props.isDisplayed) {
			return true
		} else if (nextState.step != this.state.step) {
			return true
		} else if (nextState.questionGif != this.state.questionGif) {
			return true
		} else if (nextState.isCloseHovered != this.state.isCloseHovered) {
			return true
		}  else {
			return false
		}
	}

	componentWillUpdate(nextProps, nextState) {
		// If props "form is displayed", show form
		if (nextProps.isDisplayed == true) {
			this.showForm()
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

	componentWillUnmount() {
		// Add event listener
		window.removeEventListener('keydown', this.handleKeyDown.bind(this))
	}

	handleKeyDown(e) {
		// ESC key
		if (e.keyCode == 27 && this.props.isDisplayed) {
			this.hideForm()
		} // Back key
		else if (e.keyCode == 8 && this.props.isDisplayed && this.state.step < 7) {
			e.preventDefault()
			this.previousStep()
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
					self.resetForm()
				}, 250)
			}
		})
	}

	showForm() {
		if (!this.props.isDisplayed) {
			var self = this;

			this.setState({
				step: 0,
			})

			// Tween to displayed state, props already set
			TweenMax.to(this.refs.form, .5, {
				opacity: 1,
				scale: 1,
				ease: Power2.easeInOut,
				onStart: function(){
					self.refs.form.className += ' displayed';
				}
			})
		}
	}

	nextStep(nextQuestionId) {
		if (this.state.step > 7) {
			var newStep = this.state.step
		} else if (nextQuestionId === "endPoint") {
			var newStep = 6
		} else {
			var newStep = this.state.step + 1
		}

		// set new question to display
		if (newStep > 1) {
			var newCurrentQuestionId = nextQuestionId
		} else if (newStep == 6) {
			var newCurrentQuestionId = this.state.currentQuestionId
		} else {
			var newCurrentQuestionId = 0
		}

		// Update previous questions ids array
		var previousQuestionsIds = []
		previousQuestionsIds = this.state.previousQuestionsIds
		if (newStep > 1) {
			previousQuestionsIds = previousQuestionsIds.concat(this.state.currentQuestionId)
		}

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
			if (previousQuestionsIds.length === 0) {
				newStep = 0
			}
			previousQuestionsIds = previousQuestionsIds.slice(0, -1)

			// Unset last answer
			var answersArray = []
			answersArray = this.state.answers
			answersArray = answersArray.slice(0, -4)
		} else {
			var newCurrentQuestionId = 0
			var previousQuestionsIds = []
			var answersArray = []
		}

		this.setState({
			step: newStep,
			answers: answersArray,
			previousQuestionsIds: previousQuestionsIds,
			currentQuestionId: newCurrentQuestionId,
			currentQuestion: this.state.questions[newCurrentQuestionId]
		})
	}

	setQuestionGif(value) {
		this.setState({
			questionGif: value
		})
	}

	saveAnswer(question, answer, sentence, babies, nextQuestionId) {
		var theAnswer = [question,answer,sentence, babies]
		var answersArray = []
		answersArray = this.state.answers
		answersArray = answersArray.concat(theAnswer)

		this.setState({
			answers: answersArray
		})

		// Update babies count
		this.updateNbOfBabiesBySkills()
		this.nextStep(nextQuestionId)
	}

	updateNbOfBabiesBySkills() {
		// console.log('ANSWERS', this.state.answers)
		if (this.state.answers.length > 0) {
			var babies = {
				designers: 0,
				developers: 0,
				market: 0,
				management: 0
			}

			// count babies
			for (var i = 0; i < this.state.answers.length; i = i + 4) {
				var item = this.state.answers[i+3]
				babies.designers += item.designers
				babies.developers += item.developers
				babies.market += item.market
				babies.management += item.management
			}

			this.setState({
				availablePeopleBySkills: {
					designers: babies.designers,
					developers: babies.developers,
					market: babies.market,
					management: babies.management,
				}
			})

			// console.log('BABIES HERE', this.state.availablePeopleBySkills)
		}
	}

	closeMouseOver() {
		this.setState({
			isCloseHovered: true
		})
	}

	closeMouseOut() {
		this.setState({
			isCloseHovered: false
		})
	}

	resetForm() {
		this.setState({
			step: -1,
			currentQuestionId: 0,
			currentQuestion: this.state.questions[0],
			previousQuestionsIds: [],
			answers: []
		})
	}

	render() {
		// console.log("******************************************************")
		// console.log("step", this.state.step)
		// console.log("--")
		// console.log("previousQuestionsIds", this.state.previousQuestionsIds)
		// console.log("--")
		// console.log("currentQuestionId", this.state.currentQuestionId)
		// console.log("--")
		// console.log("currentQuestion", this.state.currentQuestion)
		// console.log("******************************************************")

		var closeForm
		var button
		var gif = "/images/form/question01_bonjour.gif"

		// Button close available only if form is displayed
		if (this.props.isDisplayed) {
			var closeForm = this.hideForm.bind(this);
			var buttonClose = <button
								className="form--close"
								onClick={closeForm}
								onMouseOver={this.closeMouseOver.bind(this)}
								onMouseOut={this.closeMouseOut.bind(this)}></button>
		}

		// Button previous availability
		if (this.state.step >= 1 && this.state.step <= 6) {
			var buttonPrevious = <button className="form--previous-step"onClick={this.previousStep.bind(this)}><span>Précédent</span></button>
		}

		// Set section content
		if (this.state.step == 0) {
			gif = "/images/form/question01_bonjour.gif"
			var rightContent = <IntroStep
									step={this.state.step}
									goToNextStep={this.nextStep.bind(this)}
									goToPreviousStep={this.previousStep.bind(this)}
									formIsDisplayed={this.props.isDisplayed}
									/>
		} else if (this.state.step >= 1 && this.state.step < 6) {
			if (this.state.currentQuestion.id === 0) {
				gif = this.state.questions[0].gif
			} else {
				gif = this.state.questionGif
			}
			var rightContent = <QuestionsStep
									step={this.state.step}
									goToPreviousStep={this.previousStep.bind(this)}
									currentQuestion={this.state.currentQuestion}
									setQuestionGif={this.setQuestionGif.bind(this)}
									previousQuestionsIds={this.state.previousQuestionsIds}
									saveAnswer={this.saveAnswer.bind(this)}
									/>
		} else if (this.state.step == 6) {
			gif = "/images/form/reponse-question-bebe-tombe_youpi.gif"
			var rightContent = <SummaryStep
									step={this.state.step}
									availablePeopleBySkills={this.state.availablePeopleBySkills}
									goToNextStep={this.nextStep.bind(this)}
									/>
		} else if (this.state.step == 7) {
			gif = "/images/form/reponse-question-bebe-tombe_youpi.gif"
			var rightContent = <MailStep
									step={this.state.step}
									mailAnswers={this.state.answers}
									goToNextStep={this.nextStep.bind(this)}
									/>
		} else if (this.state.step == 8) {
			gif = "/images/form/reponse-question-bebe-tombe_youpi.gif"
			var rightContent = <ThanksStep
									step={this.state.step}
									hideForm={this.hideForm.bind(this)}
									resetForm={this.resetForm.bind(this)}
									setFinalScreenIsDisplayed={this.props.setFinalScreenIsDisplayed}
									/>
		}

		if (this.state.isCloseHovered) {
			gif = "/images/form/hover-close-form_non.gif"
		}

		return(
			<section
				ref="form"
				className="form">
				<div className="form--container">
					<div className="form--container--left">
						<img className="gif-baby" src={gif} alt=""/>
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
