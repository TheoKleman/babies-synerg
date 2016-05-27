import React from 'react'
import GSAP from 'gsap'

export default class Form extends React.Component {
    constructor() {
        super()
    }

    componentWillUpdate(nextProps) {
        // If props "form is displayed", show form
        if (nextProps.isDisplayed == true) {
            this.showForm()
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
                <h1>This is a form</h1>

                {button}
            </section>
        );
    }
}
