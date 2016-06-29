import React from "react"
import GSAP from 'gsap'

export default class FinalScreen extends React.Component {
    constructor(){
        super()
    }

    componentDidMount() {
        var self = this

        // Play video
        if (!this.props.isSoundActive) {
            this.refs.video.volume = 0
        }
        this.refs.video.play()

        // Enter animation
        TweenMax.to(this.refs.itSelf, .5, {
            opacity: 1,
            scale: 1,
            ease: Power2.easeOut,
        })

        // Timeout before closing final screen component
        var videoDuration = 19500

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
                <video
                    ref="video"
                    id="video-background"
                    src="./media/final.mp4"/>
            </section>
        )
    }
}
