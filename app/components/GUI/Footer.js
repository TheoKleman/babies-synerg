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
                        <button className="primary">
                            Partager
                        </button>
                        <button className="secondary">
                            Infos
                        </button>
                    </div>
                    <div className="misc--copyright">
                        <p><a href="">Crédits</a> / © Copyright 2016 - <a className="synerghetic" target="blank" href="http://www.synerghetic.net/">SynergHetic.net</a></p>
                    </div>
                </div>
            </footer>
        );
    }
}
