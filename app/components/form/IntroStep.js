import React from 'react'

export default class IntroStep extends React.Component {
    constructor() {
        super()

        this.state = {
            isSelected: false,
            isHovered: false
        }

        this.handleKeyDown = this.handleKeyDown.bind(this)
        this.handleKeyUp = this.handleKeyUp.bind(this)

        this.handleMouseEnter = this.handleMouseEnter.bind(this)
        this.handleMouseLeave = this.handleMouseLeave.bind(this)
        this.handleMouseDown = this.handleMouseDown.bind(this)
        this.handleMouseUp = this.handleMouseUp.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.isSelected != this.state.isSelected) {
            return true
        } else if (nextState.isHovered != this.state.isHovered) {
            return true   
        } else {
            return false
        }
    }

    componentWillMount() {
        window.addEventListener("keydown", this.handleKeyDown)
        window.addEventListener("keyup", this.handleKeyUp)
    }

    componentDidMount() {
        this.refs.keyEnter.addEventListener('mouseenter', this.handleMouseEnter)
        this.refs.keyEnter.addEventListener('mouseleave', this.handleMouseLeave)
        this.refs.keyEnter.addEventListener('mousedown', this.handleMouseDown)
        this.refs.keyEnter.addEventListener('mouseup', this.handleMouseUp)
    }

    componentWillUnmount() {
        window.removeEventListener("keydown", this.handleKeyDown)
        window.removeEventListener("keyup", this.handleKeyUp)   
        this.refs.keyEnter.removeEventListener('mouseenter', this.handleMouseEnter)
        this.refs.keyEnter.removeEventListener('mouseleave', this.handleMouseLeave)
        this.refs.keyEnter.removeEventListener('mousedown', this.handleMouseDown)
        this.refs.keyEnter.removeEventListener('mouseup', this.handleMouseUp)
    }

    handleMouseEnter() {
        this.setState({
            isHovered: true
        })
    }

    handleMouseLeave() {
        this.setState({
            isHovered: false,
            isSelected: false
        })  
    }

    handleMouseDown() {
        this.setState({
            isSelected: true,
        })
    }

    handleMouseUp() {
        this.setState({
            isSelected: false,
        })
        if (this.state.isHovered) {
            this.props.goToNextStep()
        }
    }

    handleKeyDown(e) {
        if (e.keyCode == 13) {
            this.setState({
                isSelected: true
            })
        }
    }

    handleKeyUp(e) {
        if (e.keyCode == 13) {
            this.setState({
                isSelected: false
            })
            this.props.goToNextStep()
        }   
    }

    render() {
        // Class selected
        var buttonClass = "key-enter"
        if (this.state.isSelected) {         
            buttonClass += " selected"
        }

        return(
            <section className="right--intro" ref="sectionIntro">
                <div className="content-centered">
                    <span>
                        Bonjour, je suis administrateur chez Synerg’HETIC !
                    </span>
                    <p>
                        Dites moi en plus sur votre projet digital et je selectionnerai pour vous <br /> les étudiants les plus à même de travailler avec vous ! 
                    </p>

                    <button
                        ref="keyEnter"
                        className={buttonClass}
                        >
                        <p>Commencer</p>
                    </button>
                </div>
            </section>
        );
    }
}
