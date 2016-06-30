import React from 'react'
import Draggable from 'react-draggable'

export default class Footer extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <footer className="main-footer">
                <div className="logo">
                    <img src="/images/logo.png" alt=""/>
                </div>
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
