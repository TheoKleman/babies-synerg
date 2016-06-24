import React from 'react'
import GSAP from 'gsap'

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
			previousQuestionsIds: [0,0,0],
			currentQuestionId: 0,
			questions: [
				{
					id: 0,
					text: "Quelle est la nature de votre projet ?",
					answers: [
						{
							id: 0,
							nextQuestionId: 2,
							text: "Site web"
						},
						{
							id: 1,
							nextQuestionId: 3,
							text: "Application mobile"
						},
						{
							id: 2,
							nextQuestionId: 4,
							text: "Contenu multimédia"
						},
						{
							id: 3,
							nextQuestionId: 4,
							text: "Web marketing"
						}
					]
				},
				{
					id: 1,
					text: "Disposez-vous déjà de maquettes graphiques ?",
					answers: [
						{
							id: 0,
							nextQuestionId: 3,
							text: "Oui"
						},
						{
							id: 1,
							nextQuestionId: 4,
							text: "Non"
						}
					]
				},
				{
					id: 2,
					text: "Vous voulez travailler avec nous ?",
					answers: [
						{
							id: 0,
							nextQuestionId: 1,
							text: "Oui"
						},
						{
							id: 1,
							nextQuestionId: 3,
							text: "Oui"
						},
						{
							id: 2,
							nextQuestionId: 3,
							text: "Oui"
						},
						{
							id: 3,
							nextQuestionId: 4,
							text: "Oui"
						}
					]
				},
				{
					id: 3,
					text: "Une petite dernière question pour la route ?",
					answers: [
						{
							id: 0,
							nextQuestionId: 4,
							text: "Allez"
						},
						{
							id: 1,
							nextQuestionId: 4,
							text: "Nop nop nop"
						}
					]
				},
				{
					id: 4,
					text: "J'ai plus d'inspiration, alors oui ou non ?",
					answers: [
						{
							id: 0,
							nextQuestionId: null,
							text: "Oui"
						},
						{
							id: 1,
							nextQuestionId: null,
							text: "Non"
						},
						{
							id: 2,
							nextQuestionId: null,
							text: "Je sais pas :|"
						}
					]
				}
			],
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
	}

	handleKeyDown(e) {
		// ESC key 
		if (e.keyCode == 27 && this.props.isDisplayed) {
			this.hideForm();
		}
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
		if (newStep > 1 && newStep < 6) {
			var newCurrentQuestionId = nextQuestionId
		} else {
			var newCurrentQuestionId = this.state.currentQuestionId
		}

		// Update previous questions ids array
		var previousQuestionsIds = new Array()
		previousQuestionsIds.push(this.state.previousQuestionsIds)
		console.log(previousQuestionsIds)
		previousQuestionsIds = previousQuestionsIds.push(this.state.currentQuestionId)
		console.log(previousQuestionsIds)

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

		if (newStep >= 1 && newStep < 6) {
			var newCurrentQuestionId = this.state.previousQuestionId
		} else {
			var newCurrentQuestionId = this.state.currentQuestionId
		}
		this.setState({
			step: newStep,
			currentQuestionId: newCurrentQuestionId,
			currentQuestion: this.state.questions[newCurrentQuestionId]
		})
	}

	setNextQuestionId(nextQuestionId) {
		this.setState({
			nextQuestionId: nextQuestionId
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
