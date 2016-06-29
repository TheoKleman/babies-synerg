import React from "react"
import GSAP from 'gsap'

export default class FinalScreen extends React.Component {
    constructor(){
        super()
    }

    componentDidMount() {
        var self = this

        // Enter animation
        TweenMax.to(this.refs.itSelf, .5, {
            opacity: 1,
            scale: 1,
            ease: Power2.easeOut,
        })

        // Timeout before closing final screen component
        var videoDuration = 5000

        setTimeout(function(){
            // Leave animation
            TweenMax.to(self.refs.itSelf, .5, {
                opacity: 0,
                scale: .95,
                ease: Power2.easeOut,
                onComplete: function(){
                    self.props.setFinalScreenIsDisplayed(false)
                }
            })
        }, videoDuration)
    }

    render(){
        return (
            <section ref="itSelf" className="final--screen">
                <p>ici une vidéo un jour</p>
            </section>
        )
    }
}
