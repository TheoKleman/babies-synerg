import React from 'react'

export default class FinalStep extends React.Component {
    constructor() {
        super()
    }

    componentDidMount() {
        TweenMax.to(this.refs.sectionFinal, .3, {
            scale: 1,
            ease: Power2.easeOut,
        })
    }

    endForm() {
        var self = this

        this.props.hideForm()

        setTimeout(function(){
            self.props.resetForm()
        }, 500)
    }

    render() {
        return(
            <section className="right--final" ref="sectionFinal">
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
