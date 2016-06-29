import React from 'react'

export default class ThanksStep extends React.Component {
    constructor() {
        super()
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false
    }

    componentDidMount() {
        var self = this

        setTimeout(function(){
            self.goToFinalScreen()
        }, 3500)
    }

    goToFinalScreen() {
        var self = this
        
        this.props.hideForm()
        this.props.setFinalScreenIsDisplayed(true)

        setTimeout(function(){
            self.props.resetForm()
        }, 500)
    }

    render() {
        return(
            <section className="right--thanks" ref="sectionIntro">
                <div className="content-centered">
                    <span>
                        Votre projet a bien ete envoye !
                    </span>
                    <p>
                        Merci de votre message. Nous vous rencontacterons dans les plus brefs délais <br />
                        pour préciser votre projet !
                    </p>
                </div>
            </section>
        );
    }
}
