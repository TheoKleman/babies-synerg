import React from 'react'

export default class IntroStep extends React.Component {
    constructor() {
        super()
    }

    componentWillMount() {
        window.addEventListener("keyup", this.handleKeyUp.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("keyup", this.handleKeyUp.bind(this))   
    }

    componentDidMount() {
        TweenMax.to(this.refs.sectionIntro, .3, {
            scale: 1,
            ease: Power2.easeOut,
        })
    }

    handleKeyUp(e) {
        if (e.keyCode == 13 && this.props.formIsDisplayed && this.props.step == 0) {
            this.props.goToNextStep()
        }
    }

    render() {
        return(
            <section className="right--intro" ref="sectionIntro">
                <div className="content-centered">
                    <span>
                        Bonjour, je suis administrateur chez Synerg’HETIC !
                    </span>
                    <p>
                        Dites moi en plus sur votre projet digital et je selectionnerai pour vous les étudiants les plus à même de travailler avec vous ! 
                    </p>

                    <button
                        className="key-enter"
                        onClick={this.props.goToNextStep.bind(this)}
                        >
                    </button>
                </div>
            </section>
        );
    }
}
