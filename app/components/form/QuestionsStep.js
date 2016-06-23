import React from 'react'

import AnswerItem from './AnswerItem'

export default class QuestionsStep extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        TweenMax.to(this.refs.sectionQuestions, .3, {
            scale: 1,
            ease: Power2.easeOut,
        })
    }

    render() {
        // get currentQuestion
        var currentQuestion = this.props.currentQuestion

        // Toggle btn
        var goToNextStep = this.props.goToNextStep.bind(this)

        // Var question number 
        var questionNumber = 0
        if (currentQuestion.id < this.props.questions.length) {
            questionNumber = currentQuestion.id + 1
        } else {
            questionNumber = currentQuestion.id
        }

        return(
            <section className="right--questions" ref="sectionQuestions">
                <div className="content-centered">
                    <span className="question">
                        <small>Question {questionNumber} / {this.props.questions.length}</small>
                        <br />
                        {currentQuestion.text}
                    </span>
                    <div className="form--answers">
                        {
                            currentQuestion.answers.map(function(answer, i){
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
