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

        // Set last answer
        var setNextQuestionId = this.props.setNextQuestionId.bind(this)

        // Var question number 
        var questionNumber = this.props.step

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
                                    goToNextStep={goToNextStep}
                                    setNextQuestionId={setNextQuestionId}/>
                            })
                        }
                    </div>
                </div>
            </section>
        );
    }
}
