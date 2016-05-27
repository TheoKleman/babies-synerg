import React from 'react'
import GSAP from 'gsap'

export default class Form extends React.Component {
    constructor() {
        super()
    }

    componentWillUpdate(nextProps) {
        if (nextProps.isDisplayed == true) {
            this.showForm()
        }
    }

    hideForm() {
        var self = this;
        // console.log("hideForm")

        TweenMax.to(this.refs.form, .5, {
            opacity: 0,
            scale: .95,
            ease: Power2.easeOut,
            onComplete: function(){
                self.refs.form.className = 'form';
                setTimeout(function(){
                    self.props.setFormIsDisplayedProps(false)
                    console.log("Board movable")
                }, 200)
            }
        })
    }

    showForm() {
        var self = this;
        // console.log("showForm")

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
