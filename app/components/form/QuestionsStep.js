import React from 'react'

import AnswerItem from './AnswerItem'

export default class QuestionsStep extends React.Component {
    constructor() {
        super()

        this.state = {
            questions: [
                {
                    id: 1,
                    text: "Quelle est la nature de votre projet ?",
                    answers: [
                        {
                            id: 1,
                            text: "Site web"
                        },
                        {
                            id: 2,
                            text: "Application mobile"
                        },
                        {
                            id: 3,
                            text: "Contenu multimédia"
                        },
                        {
                            id: 4,
                            text: "Web marketing"
                        }
                    ]
                },
                {
                    id: 2,
                    text: "Disposez-vous déjà de maquettes graphiques ?",
                    answers: [
                        {
                            id: 1,
                            text: "Oui"
                        },
                        {
                            id: 2,
                            text: "Non"
                        }
                    ]
                },
            ],
            "currentQuestionId": 0,
        }
    }

    componentWillMount() {
        this.setState({
            "currentQuestion": this.state.questions[this.state.currentQuestionId]
        })
    }

    toggleQuestion(currentQuestionId){
        this.props.goToNextStep.bind(this);

        var newCurrentQuestionId = currentQuestionId + 1
        this.setState({
            "currentQuestionId": newCurrentQuestionId,
            "currentQuestion": this.state.questions[newCurrentQuestionId]
        })
    }

    render() {
        // Set if this step is displayed or not
        var style = {
            display: 'none'
        }
        if (this.props.step >= 1) {
            style = {
                display: 'block'
            }
        }

        // Toggle btn
        var goToNextStep = this.toggleQuestion.bind(this, this.state.currentQuestionId)

        return(
            <section className="right--questions" style={style}>
                <div className="content-centered">
                    <span className="question">
                        <small>Question 1/6</small>
                        <br />
                        {this.state.currentQuestion.text}
                    </span>
                    
                    <div className="form--answers">
                        {
                            this.state.currentQuestion.answers.map(function(answer, i){
                                return <AnswerItem 
                                    key={answer.id}
                                    answerId={answer.id}
                                    answerText={answer.text}
                                    goToNextStep={goToNextStep}/>
                            })
                        }
                    </div>
                </div>
            </section>
        );
    }
}
