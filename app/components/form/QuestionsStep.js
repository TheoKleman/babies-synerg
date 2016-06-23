import React from 'react'

import AnswerItem from './AnswerItem'

export default class QuestionsStep extends React.Component {
    constructor() {
        super()
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
            <section className="right--questions" style={style}>
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
