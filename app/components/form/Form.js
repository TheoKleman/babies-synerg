import React from 'react'
import GSAP from 'gsap'

export default class Form extends React.Component {
    constructor() {
        super()
    }

    componentWillUpdate(nextProps) {
        if (nextProps.isDisplayed) {
            this.showForm()
        }
    }

    removeDisplayedClass() {
        this.refs.form.className = 'form';
    }

    hideForm() {
        console.log("hideForm")
        TweenMax.to(this.refs.form, .5, {
            opacity: 0,
            scale: .95,
            ease: Power2.easeOut,
            onComplete: this.removeDisplayedClass.bind(this)
        })
    }

    showForm() {
        console.log("showForm")
        this.refs.form.className += ' displayed';
        TweenMax.to(this.refs.form, .5, {
            opacity: 1,
            scale: 1,
            ease: Power2.easeOut,
        })
    }

    closeForm() {
        console.log("close form called")
        this.hideForm()
        this.props.setFormIsDisplayedProps(false)
    }

    render() {
        return(
            <section
                ref="form"
                className="form">
                <h1>This is a form</h1>

                <button
                    className="primary"
                    onClick={this.closeForm.bind(this)}>
                    Close
                </button>
            </section>
        );
    }
}
