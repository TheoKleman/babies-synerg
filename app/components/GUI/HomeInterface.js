import React from 'react'

export default class HomeInterface extends React.Component {
    constructor() {
        super()
    }

    render() {
        return(
            <footer className="home-interface-bottom-left">
                <div className="logo">
                    <img src="/images/logo.png" alt=""/>
                </div>
                <div className="misc">
                    <div className="misc--buttons">
                        <button className="primary">
                            Share
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
        );
    }
}
