import React from 'react'
import Draggable from 'react-draggable'

export default class Footer extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <Draggable
                axis="both"
                handle="footer"
                bounds={{top: -100, left: 0, right: 100, bottom: 0}}>
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
                            <p>Crédits / © Copyright 2016 - <a target="blank" href="http://www.synerghetic.net/">SynergHetic.net</a></p>
                        </div>
                    </div>
                </footer>
            </Draggable>
        );
    }
}
