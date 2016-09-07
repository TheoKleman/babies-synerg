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

    componentDidMount() {
        console.log('mounted')
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
                            text=Coucou Dali"
                            className="btn primary"
                            target="_blank">
                            Partager
                        </a>
                        <button className="secondary" onClick={this.props.openPage.bind(this, 'about')}>
                            Infos
                        </button>
                    </div>
                    <div className="misc--copyright">
                        <p><a onClick={this.props.openPage.bind(this, 'credits')}>Crédits</a> / © Copyright 2016 - <a className="synerghetic" target="blank" href="http://www.synerghetic.net/">Synerg'hetic.net</a></p>
                    </div>
                </div>
            </footer>
        );
    }
}
