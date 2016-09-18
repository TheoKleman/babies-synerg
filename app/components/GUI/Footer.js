import React from 'react'
import Draggable from 'react-draggable'
import SpriteAnimator from 'react-sprite-animator'

var classNames = require('classnames')

export default class Footer extends React.Component {
    constructor() {
        super()

        this.state = {
            showNyan: false
        }

        this.nyanAudio = document.createElement('audio');
        this.nyanAudio.src = './media/nyancat.wav'
        this.nyanAudio.volume = 0.4
    }

    handleMouseEnter(e) {
        this.nyanAudio.currentTime = 0
        this.nyanAudio.play()
        this.setState({
            showNyan: true
        })
    }

    handleMouseLeave(e) {
        this.nyanAudio.pause()
        this.setState({
            showNyan: false
        })
    }

    render() {

        const {showNyan} = this.state

        var nyanClasses = classNames({
            'nyan-sprite': true,
            'show-nyan': this.state.showNyan
        })

        return(
            <footer className="main-footer">
                <a
                    onMouseEnter={this.handleMouseEnter.bind(this)}
                    onMouseLeave={this.handleMouseLeave.bind(this)}
                    href="http://www.synerghetic.net/"
                    className="logo"
                    target="_blank">
                    <img src="/images/logo.png" alt=""/>
                </a>
                <SpriteAnimator
                        ref="bodyAnimation"
                        className={nyanClasses}
                        sprite="images/animation-nyan.png"
                        width={360}
                        height={360}
                        timeout={80}
                        shouldAnimate={showNyan} />
                <div className="misc">
                    <div className="misc--buttons">
                        <a
                            href="https://twitter.com/intent/tweet?
                            text="
                            className="btn primary"
                            target="_blank">
                            <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1343 12v264h-157q-86 0-116 36t-30 108v189h293l-39 296h-254v759h-306v-759h-255v-296h255v-218q0-186 104-288.5t277-102.5q147 0 228 12z" fill="#fff"/></svg>
                        </a>
                        <a
                            href=""
                            className="btn primary"
                            target="_blank">
                            <svg width="1792" height="1792" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg"><path d="M1684 408q-67 98-162 167 1 14 1 42 0 130-38 259.5t-115.5 248.5-184.5 210.5-258 146-323 54.5q-271 0-496-145 35 4 78 4 225 0 401-138-105-2-188-64.5t-114-159.5q33 5 61 5 43 0 85-11-112-23-185.5-111.5t-73.5-205.5v-4q68 38 146 41-66-44-105-115t-39-154q0-88 44-163 121 149 294.5 238.5t371.5 99.5q-8-38-8-74 0-134 94.5-228.5t228.5-94.5q140 0 236 102 109-21 205-78-37 115-142 178 93-10 186-50z" fill="#fff"/></svg>
                        </a>
                        <button className="secondary" onClick={this.props.setOpenPage.bind(this, 'about')}>
                            Infos
                        </button>
                    </div>
                    <div className="misc--copyright">
                        <p><a onClick={this.props.setOpenPage.bind(this, 'credits')}>Crédits</a> / © Copyright 2016 - <a className="synerghetic" target="blank" href="http://www.synerghetic.net/">Synerg'hetic.net</a></p>
                    </div>
                </div>
            </footer>
        );
    }
}
