import React from "react"

import qwest from "qwest"
var Preload = require('react-preload').Preload;

import Konami from "konami-js"

import FinalScreen from "./FinalScreen.js"
import Form from "./form/Form.js"
import Board from "./babiesboard/Board"
import Footer from "./GUI/Footer.js"
import FilterNav from "./GUI/FilterNav.js"
import Controls from "./GUI/Controls.js"

import About from './pagemanager/pages/About.js'

export default class App extends React.Component {
    constructor(){
        super()

        this.state = {
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight,
            },
            boardCanTranslate: true,
            finalScreenDisplayed: false,
            formDisplayed: false,
            controlsHighlighting: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            },
            boardWidth: 4400,
            boardHeight: 2475,
            isSorted: false,
            isSoundActive: true,
            focusedBabyGroup: "",
            pageToShow: null
        }

        this.setFinalScreenIsDisplayed = this.setFinalScreenIsDisplayed.bind(this)
    }

    componentDidMount(){
        window.addEventListener('resize', this.handleResize.bind(this))

        var self = this

        new Konami(function(){
            self.setState({
                finalScreenDisplayed: true,
                boardCanTranslate: false
            })
        });
    }

    componentWillMount() {
        qwest
            .get("/json/images.json")
            .then((xhr, response) => {
                this.setState({
                    imagesToLoad: response
                })
            })
    }

    setControlHighlighting(control) {
        var self = this;
        var top = false
        var right = false
        var left = false
        var bottom = false

        switch (control) {
            case "top":
                top = true
                break
            case "right":
                right = true
                break
            case "bottom":
                bottom = true
                break
            case "left":
                left = true
                break
        }

        this.setState({
            controlsHighlighting: {
                top: top,
                right: right,
                bottom: bottom,
                left: left,
            }
        })
    }
    
    unsetControlsHighlighting() {
        this.setState({
            controlsHighlighting: {
                top: false,
                right: false,
                bottom: false,
                left: false,
            }
        })
    }

    setFormIsDisplayedState(value) {
        this.setState({
            formDisplayed: value,
            boardCanTranslate: !value
        })
    }

    setFinalScreenIsDisplayed(value) {
        this.setState({
            finalScreenDisplayed: value,
            boardCanTranslate: !value
        })
    }

    setSorting(value) {
        this.setState({
            isSorted: value
        })
    }

    setSound(value) {
        this.setState({
            isSoundActive: value
        })
    }

    setGroupFocus(value) {
        this.setState({
            focusedBabyGroup: value
        })
    }

    handleResize(){
        this.setState({
            viewportSize: {
                width: window.innerWidth,
                height: window.innerHeight,
            }
        })
    }

    handleImageLoaderError() {
        console.log('Error loading images')
    }

    openPage(pageSlug) {
        var page

        switch(pageSlug) {
            case 'about':
                page = <About />
                break;
        }

        this.setState({
            pageToShow: page
        })
    }

    render(){
        var finalScreen
        if (this.state.finalScreenDisplayed) {
            finalScreen = <FinalScreen
                            isSoundActive={this.state.isSoundActive} 
                            setFinalScreenIsDisplayed={this.setFinalScreenIsDisplayed.bind(this)} />
        }

        var loadingIndicator = (<div id="loader">Loading...</div>)
        var myImages = this.state.imagesToLoad
        var images = []
        if(myImages != undefined) {
            var images = myImages.images
        }

        return (
            <Preload
                    loadingIndicator={loadingIndicator}
                    images={images}
                    onError={this.handleImageLoaderError}
                    autoResolveDelay={3000}
                    mountChildren={true}>
                    <div
                        className="main-content">
                        <section id="responsive">
                            <div>
                                <img src="/images/form/question14_dab.gif" alt=""/>
                                <p>Ce site web n'est pas disponible sur les appareils disposant d'une résolution inférieure à 1280px !</p>
                            </div>
                        </section>
                        {finalScreen}
                        {pageToShow}
                        <Form
                            isDisplayed={this.state.formDisplayed}
                            setFormIsDisplayedProps={this.setFormIsDisplayedState.bind(this)}
                            setFinalScreenIsDisplayed={this.setFinalScreenIsDisplayed.bind(this)} />
                        <Board
                            viewportSize={this.state.viewportSize}
                            // scrollDelta={this.state.scrollDelta}
                            formDisplayed={this.state.formDisplayed}
                            canTranslate={this.state.boardCanTranslate}
                            setFormIsDisplayedProps={this.setFormIsDisplayedState.bind(this)}
                            setSorting={this.setSorting.bind(this)}
                            isSorted={this.state.isSorted}
                            controlsHighlighting={this.state.controlsHighlighting}
                            setControlHighlighting={this.setControlHighlighting.bind(this)}
                            unsetControlsHighlighting={this.unsetControlsHighlighting.bind(this)}
                            focusedBabyGroup={this.state.focusedBabyGroup}
                            isSoundActive={this.state.isSoundActive}  />
                        <FilterNav
                            formDisplayed={this.state.formDisplayed}
                            isSorted={this.state.isSorted}
                            setSorting={this.setSorting.bind(this)}
                            setGroupFocus={this.setGroupFocus.bind(this)} />
                        <Footer
                            openPage={this.openPage.bind(this, pageSlug)} />
                        <Controls 
                            controlsHighlighting={this.state.controlsHighlighting}
                            formDisplayed={this.state.formDisplayed}
                            isSoundActive={this.state.isSoundActive}
                            setSound={this.setSound.bind(this)} />
                    </div>
                </Preload>
        )
    }
}
