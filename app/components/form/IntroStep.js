import React from 'react'

export default class IntroStep extends React.Component {
    constructor() {
        super()

        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    componentWillMount() {
        window.addEventListener("keyup", this.handleKeyUp)
    }

    componentWillUnmount() {
        window.removeEventListener("keyup", this.handleKeyUp)   
    }

    componentDidMount() {
        TweenMax.to(this.refs.sectionIntro, 2, {
            y: 0,
            ease: Elastic.easeOut.config(1, 0.3),
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
                        Dites moi en plus sur votre projet digital et je selectionnerai pour vous <br /> les étudiants les plus à même de travailler avec vous ! 
                    </p>

                    <button
                        className="key-enter"
                        onClick={this.props.goToNextStep.bind(this)}
                        >
                        <p>Commencer</p>
                    </button>
                </div>
            </section>
        );
    }
}
