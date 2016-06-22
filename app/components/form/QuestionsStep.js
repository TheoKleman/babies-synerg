import React from 'react'

export default class QuestionsStep extends React.Component {
    constructor() {
        super()
    }

    toggleBtn(ref) {
        if (this.hasClass(ref, "selected")) {
            ref.className = "form--answers--item"
        } else {
            // Remove siblings "selected" class
            for (var i = 0; i < ref.parentNode.childNodes.length; i++) {
                ref.parentNode.childNodes[i].className = "form--answers--item"
            }
            // Add "selected" class to ref
            ref.className = "form--answers--item selected"
        }
    }

    hasClass(element, cls) {
        return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
    }

    render() {
        var style = {
            display: 'none'
        }
        if (this.props.step == 1) {
            style = {
                display: 'block'
            }
        }

        return(
            <section className="right--questions" style={style}>
                <div className="content-vertically-centered">
                    <span className="question">
                        <small>Question 1/6</small>
                        <br />
                        Quelle est la nature de votre projet ?
                    </span>
                    
                    <div className="form--answers">
                        <div
                            className="form--answers--item"
                            ref="answer1"
                            onClick={this.toggleBtn.bind(this, this.refs.answer1)}
                            >
                            <button className="key">
                                <span className="key--content">A</span>
                                <span className="key--double"></span>
                            </button>
                            <div className="item--answer">
                                <p>Site web</p>
                            </div>
                        </div>

                        <div
                            className="form--answers--item"
                            ref="answer2"
                            onClick={this.toggleBtn.bind(this, this.refs.answer2)}
                            >
                            <button className="key">
                                <span className="key--content">B</span>
                                <span className="key--double"></span>
                            </button>
                            <div className="item--answer">
                                <p>Application mobile</p>
                            </div>
                        </div>

                        <div
                            className="form--answers--item"
                            ref="answer3"
                            onClick={this.toggleBtn.bind(this, this.refs.answer3)}
                            >
                            <button className="key">
                                <span className="key--content">C</span>
                                <span className="key--double"></span>
                            </button>
                            <div className="item--answer">
                                <p>Contenu multimédia</p>
                            </div>
                        </div>

                        <div
                            className="form--answers--item"
                            ref="answer4"
                            onClick={this.toggleBtn.bind(this, this.refs.answer4)}
                            >
                            <button className="key">
                                <span className="key--content">D</span>
                                <span className="key--double"></span>
                            </button>
                            <div className="item--answer">
                                <p>Web marketing</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}
