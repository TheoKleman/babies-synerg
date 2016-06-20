import React from 'react'
import GSAP from 'gsap'

export default class Form extends React.Component {
    constructor() {
        super()

        this.state = {
            step: 0,
            stepMax: 6,
        }
    }

    componentWillUpdate(nextProps) {
        // If props "form is displayed", show form
        if (nextProps.isDisplayed == true) {
            this.showForm()
        }
    }

    componentWillMount() {
        // Add event listener
        window.addEventListener('keydown', this.handleKeyDown.bind(this))
    }

    handleKeyDown(e) {
        // ESC key 
        if (e.keyCode == 27 && this.props.isDisplayed) {
            this.hideForm();
        }
    }

    hideForm() {
        var self = this;

        // Tween to hidden state + set props
        TweenMax.to(this.refs.form, .5, {
            opacity: 0,
            scale: .95,
            ease: Power2.easeOut,
            onComplete: function(){
                self.refs.form.className = 'form';
                setTimeout(function(){
                    self.props.setFormIsDisplayedProps(false)
                }, 250)
            }
        })
    }

    showForm() {
        var self = this;

        // Tween to displayed state, props already set
        TweenMax.to(this.refs.form, .5, {
            opacity: 1,
            scale: 1,
            ease: Power2.easeOut,
            onStart: function(){
                self.refs.form.className += ' displayed';
            }
        })
    }

    nextStep() {
        if (this.state.step >= this.state.stepMax) {
            var newStep = this.state.step
        } else {
            var newStep = this.state.step + 1
        }

        this.setState({
            step: newStep
        })
    }

    previousStep() {
        if (this.state.step <= 0) {
            var newStep = 0
        } else {
            var newStep = this.state.step - 1
        }

        this.setState({
            step: newStep
        })
    }

    switchToStep(step) {
        var newStep = this.refs.inputStep.value * 1

        if (newStep <= 0) {
            var newStep = 0
        } else if (newStep >= this.state.stepMax) {
            var newStep = this.state.stepMax
        }

        this.setState({
            step: newStep
        })
    }

    render() {
        var closeForm
        var button

        // Button available only if form is displayed
        if (this.props.isDisplayed) {
            var closeForm = this.hideForm.bind(this);
            var button = <button className="primary" onClick={closeForm}>Close</button>
        }

        return(
            <section
                ref="form"
                className="form">
                <p>current step : {this.state.step}</p>
                <br/>

                <h1>Previous/Next step</h1>
                <button onClick={this.previousStep.bind(this)}>Previous step</button>
                <button onClick={this.nextStep.bind(this)}>Next step</button>
                <br/>
                <h1>Swictch to new step</h1>
                <input type="number" placeholder="Enter a step value" ref="inputStep"/>
                <button onClick={this.switchToStep.bind(this)}>Switch to step</button>

                {button}
            </section>
        );
    }
}
