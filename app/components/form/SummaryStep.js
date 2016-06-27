import React from 'react'

export default class SummaryStep extends React.Component {
    constructor() {
        super()

        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentWillMount() {
        window.addEventListener("keydown", this.handleKeyDown)
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown)   
    }

    componentDidMount() {
        TweenMax.to(this.refs.sectionSummary, .3, {
            scale: 1,
            ease: Power2.easeOut,
        })
    }

    handleKeyDown(e) {
        if (e.keyCode == 32 && this.props.formIsDisplayed) {
            this.props.goToNextStep()
        }
    }

    render() {
        var designers = this.props.peopleAvailable.designers
        var developers = this.props.peopleAvailable.developers
        var market = this.props.peopleAvailable.market
        var management = this.props.peopleAvailable.management
        var total =  designers + developers + market + management

        return(
            <section className="right--summary" ref="sectionSummary">
                <div className="content-centered">
                    <span>
                        {total}
                        <small>
                            etudiants sont a meme de travailler sur votre projet !
                        </small>
                    </span>
                    <ul>
                        <li>{designers}<small>designers</small></li>
                        <li>{developers}<small>developpeurs</small></li>
                        <li>{market}<small>marketeux</small></li>
                        <li>{management}<small>chefs de projet</small></li>
                    </ul>

                    <button 
                        className="key spacebar"
                        onClick={this.props.goToNextStep.bind(this)}
                        >
                        <span className="key--content">Prendre contact avec Synerg'Hetic</span>
                        <span className="key--double"></span>
                    </button>
                </div>
            </section>
        );
    }
}
