import React from 'react'

export default class IntroStep extends React.Component {
    constructor() {
        super()
    }

    render() {
        var style = {
            display: 'none'
        }
        if (this.props.step == 0) {
            style = {
                display: 'block'
            }
        }

        return(
            <section className="right--intro" style={style}>
                <div className="content-vertically-centered">
                    <span>
                        BONJOUR, JE SUIS administrateur chez Synerg’HETIC !
                    </span>
                    <p>
                        Dites moi en plus sur votre projet digital et je selectionnerai pour vous les étudiants les plus à même de travailler avec vous ! 
                    </p>

                    <button
                        className="key-enter"
                        onClick={this.props.goToNextStep}
                        >
                    </button>
                </div>
            </section>
        );
    }
}
