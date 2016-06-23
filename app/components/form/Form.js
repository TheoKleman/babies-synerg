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
            currentQuestionId: 0,
            questions: [
                {
                    id: 0,
                    text: "Quelle est la nature de votre projet ?",
                    answers: [
                        {
                            id: 0,
                            text: "Site web"
                        },
                        {
                            id: 1,
                            text: "Application mobile"
                        },
                        {
                            id: 2,
                            text: "Contenu multimédia"
                        },
                        {
                            id: 3,
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
                            text: "Oui"
                        },
                        {
                            id: 1,
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
                            text: "Oui"
                        },
                        {
                            id: 1,
                            text: "Oui"
                        },
                        {
                            id: 2,
                            text: "Oui"
                        },
                        {
                            id: 3,
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
                            text: "Allez"
                        },
                        {
                            id: 1,
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
                            text: "Oui"
                        },
                        {
                            id: 1,
                            text: "Non"
                        },
                        {
                            id: 2,
                            text: "Je sais pas :|"
                        }
                    ]
                }
            ],
        }
    }

    componentWillUpdate(nextProps) {
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

    nextStep() {
        if (this.state.step >= this.state.stepMax) {
            var newStep = this.state.step
        } else {
            var newStep = this.state.step + 1
        }

        if (newStep > 1 && this.state.currentQuestionId < this.state.questions.length - 1) {
            var newCurrentQuestionId = this.state.currentQuestionId + 1
        } else {
            var newCurrentQuestionId = this.state.currentQuestionId
        }
        this.setState({
            step: newStep,
            "currentQuestionId": newCurrentQuestionId,
            "currentQuestion": this.state.questions[newCurrentQuestionId]
        })
    }

    previousStep() {
        if (this.state.step <= 0) {
            var newStep = 0
        } else {
            var newStep = this.state.step - 1
        }

        if (newStep >= 1 && newStep < this.state.questions.length && this.state.currentQuestionId <= this.state.questions.length - 1) {
            var newCurrentQuestionId = this.state.currentQuestionId - 1
        } else {
            var newCurrentQuestionId = this.state.currentQuestionId
        }
        this.setState({
            step: newStep,
            "currentQuestionId": newCurrentQuestionId,
            "currentQuestion": this.state.questions[newCurrentQuestionId]
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
        if (this.state.step >=1 && this.state.step <= this.state.questions.length) {
            var buttonPrevious = <button className="form--previous-step"onClick={this.previousStep.bind(this)}><span>Précédent</span></button>
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
                        <IntroStep
                            step={this.state.step}
                            goToNextStep={this.nextStep.bind(this)}
                            goToPreviousStep={this.previousStep.bind(this)}
                            formIsDisplayed={this.props.isDisplayed}
                            />
                        <QuestionsStep
                            step={this.state.step}
                            goToNextStep={this.nextStep.bind(this)}
                            goToPreviousStep={this.previousStep.bind(this)}
                            formIsDisplayed={this.props.isDisplayed}
                            currentQuestionId={this.state.currentQuestionId}
                            questions={this.state.questions}
                            currentQuestion={this.state.currentQuestion}
                            />
                        <FinalStep 
                            step={this.state.step}
                            questions={this.state.questions}
                            hideForm={this.hideForm.bind(this)}
                            />
                    </div>
                </div>

                {buttonClose}

                {buttonPrevious}
            </section>
        );
    }
}
