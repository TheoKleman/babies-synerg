import React from 'react'

export default class FinalStep extends React.Component {
    constructor() {
        super()
    }

    endForm() {
        var self = this

        this.props.hideForm()

        setTimeout(function(){
            self.props.resetForm()
        }, 500)
    }

    render() {
        var style = {
            display: 'none'
        }
        if (this.props.step == this.props.questions.length + 1) {
            style = {
                display: 'block'
            }
        }

        return(
            <section className="right--final" style={style}>
                <div className="content-centered">
                    <span>
                        Merci !
                    </span>
                    <p>
                        Votre mail a bien été envoyé à <b>Synerghetic</b> !
                    </p>

                    <button 
                        className="key spacebar"
                        onClick={this.endForm.bind(this)}
                        >
                        <span className="key--content">such wow</span>
                        <span className="key--double"></span>
                    </button>
                </div>
            </section>
        );
    }
}
