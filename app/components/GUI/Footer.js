import React from 'react'
import Draggable from 'react-draggable'
import SpriteAnimator from 'react-sprite-animator'

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

        if(this.state.showNyan) {
            var nyanCat = <SpriteAnimator
                        ref="bodyAnimation"
                        className="nyan-sprite"
                        sprite="images/animation-nyan.png"
                        width={360}
                        height={360}
                        timeout={80}
                        shouldAnimate={true} />
        }

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
                {nyanCat}
                <div className="misc">
                    <div className="misc--buttons">
                        <a 
                            href="https://twitter.com/intent/tweet?
                            text=Coucou Dali"
                            className="btn primary"
                            target="_blank">
                            Partager
                        </a>
                        <button className="secondary">
                            Infos
                        </button>
                    </div>
                    <div className="misc--copyright">
                        <p><a href="">Crédits</a> / © Copyright 2016 - <a className="synerghetic" target="blank" href="http://www.synerghetic.net/">Synerg'hetic.net</a></p>
                    </div>
                </div>
            </footer>
        );
    }
}
