import React from 'react'
import GSAP from 'gsap'
import qwest from 'qwest'

import IntroStep from './IntroStep'
import QuestionsStep from './QuestionsStep'
import SummaryStep from './SummaryStep'
import MailStep from './MailStep'

export default class Form extends React.Component {
	constructor() {
		super()

		this.state = {
			step: 0,
			stepMax: 7,
			previousQuestionsIds: [],
			currentQuestion: {},
			currentQuestionId: 0,
			questions: [],
			answers:[],
			availablePeople: {
				uiDesigners: 22,
				motionDesigners: 12,
				mobileDesigners: 15,
				montageDesigners: 3,
				realisationDesigners: 4,
				strategieDesigners: 2,
				illuDesigners: 0,
				threeDDesigners: 24,
				frontDevelopers: 25,
				backDevelopers: 5,
				iOSDevelopers: 33,
				androidDevelopers: 0,
				phonegapDevelopers: 3,
				strategieDevelopers: 4,
				strategieMarket: 0,
				seoMarket: 16,
				seaMarket: 2,
				smoMarket: 0,
				management: 6
			},
			availablePeopleBySkills: {
				designers: 0,
				developers: 0,
				market: 0,
				management: 0,
			}
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

		this.loadBabies()
		this.loadQuestions()
	}

	componentWillUnmount() {
		// Add event listener
		window.removeEventListener('keydown', this.handleKeyDown.bind(this))
	}

	handleKeyDown(e) {
		// ESC key 
		if (e.keyCode == 27 && this.props.isDisplayed) {
			this.hideForm();
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
		} else if (nextQuestionId === "endPoint") {
			var newStep = 6
			this.updateNbOfBabiesBySkills()
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

	saveAnswer(question, answer, sentence, babies) {
		var theAnswer = [question,answer,sentence, babies]
		var answersArray = []
		answersArray = this.state.answers
		answersArray = answersArray.concat(theAnswer)

		this.setState({
			answers: answersArray
		})
	}

	updateNbOfBabiesBySkills() {
		var babies = {
			uiDesigners: 0,
			motionDesigners: 0,
			mobileDesigners: 0,
			montageDesigners: 0,
			realisationDesigners: 0,
			strategieDesigners: 0,
			illuDesigners: 0,
			threeDDesigners:0,
			frontDevelopers: 0,
			backDevelopers: 0,
			iOSDevelopers: 0,
			androidDevelopers: 0,
			phonegapDevelopers: 0,
			strategieDevelopers: 0,
			strategieMarket: 0,
			seoMarket: 0,
			seaMarket: 0,
			smoMarket: 0,
			management: 0
		}

		for (var i = 0; i < this.state.answers.length; i = i + 4) {
			var item = this.state.answers[i+3]
			babies.uiDesigners += item.uiDesigners
			babies.motionDesigners += item.motionDesigners
			babies.mobileDesigners += item.mobileDesigners
			babies.montageDesigners += item.montageDesigners
			babies.realisationDesigners += item.realisationDesigners
			babies.strategieDesigners += item.strategieDesigners
			babies.illuDesigners += item.illuDesigners
			babies.threeDDesigner += item.threeDDesigner
			babies.frontDevelopers += item.frontDevelopers
			babies.backDevelopers += item.backDevelopers
			babies.iOSDevelopers += item.iOSDevelopers
			babies.androidDevelopers += item.androidDevelopers
			babies.phonegapDevelopers += item.phonegapDevelopers
			babies.strategieDevelopers += item.strategieDevelopers
			babies.strategieMarket += item.strategieMarket
			babies.seoMarket += item.seoMarket
			babies.seaMarket += item.seaMarket
			babies.smoMarket += item.smoMarket
			babies.management += item.management
		}

		this.setState({
			availablePeople: {
				uiDesigners: babies.uiDesigners
				motionDesigners: babies.motionDesigners
				mobileDesigners: babies.mobileDesigners
				montageDesigners: babies.montageDesigners
				realisationDesigners: babies.realisationDesigners
				strategieDesigners: babies.strategieDesigners
				illuDesigners: babies.illuDesigners
				threeDDesigner: babies.threeDDesigner
				frontDevelopers: babies.frontDevelopers
				backDevelopers: babies.backDevelopers
				iOSDevelopers: babies.iOSDevelopers
				androidDevelopers: babies.androidDevelopers
				phonegapDevelopers: babies.phonegapDevelopers
				strategieDevelopers: babies.strategieDevelopers
				strategieMarket: babies.strategieMarket
				seoMarket: babies.seoMarket
				seaMarket: babies.seaMarket
				smoMarket: babies.smoMarket
				management: babies.management
			}
		})

		// count babies
		var designers = babies.uiDesigners + babies.motionDesigners + babies.mobileDesigners + babies.montageDesigners + babies.realisationDesigners + babies.strategieDesigners + babies.illuDesigners + babies.threeDDesigners
		var developers = babies.frontDevelopers + babies.backDevelopers + babies.iOSDevelopers + babies.androidDevelopers + babies.phonegapDevelopers + babies.strategieDevelopers
		var market = babies.strategieMarket + babies.seoMarket + babies.seaMarket + babies.smoMarket
		var management = babies.management

		this.setState({
			availablePeopleBySkills: {
				designers: designers,
				developers: developers,
				market: market,
				management: management,	
			}
		})
	}

	resetForm() {
		this.setState({
			step: 0,
			currentQuestionId: 0,
			currentQuestion: this.state.questions[0],
			previousQuestionsIds: [],
			answers: []
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
									formIsDisplayed={this.props.isDisplayed}
									goToNextStep={this.nextStep.bind(this)}
									goToPreviousStep={this.previousStep.bind(this)}
									currentQuestion={this.state.currentQuestion}
									previousQuestionsIds={this.state.previousQuestionsIds}
									saveAnswer={this.saveAnswer.bind(this)}
									/>   
		} else if (this.state.step == 6) {
			var rightContent = <SummaryStep 
									step={this.state.step}
									formIsDisplayed={this.props.isDisplayed}
									existingPeople={this.state.existingPeople}
									availablePeopleBySkills={this.state.availablePeopleBySkills}
									goToNextStep={this.nextStep.bind(this)}
									/>
		} else if (this.state.step == 7) {
			var rightContent = <MailStep 
									step={this.state.step}
									mailAnswers={this.state.answers}
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
