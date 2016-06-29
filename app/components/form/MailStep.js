import React from 'react'
import qwest from 'qwest'

export default class MailStep extends React.Component {
	constructor() {
		super()

		this.state = {
			isSelected: false,
			isHovered: false,
			isMailValid: false,
			isMailChecked: false,
		}

		this.handleMouseEnter = this.handleMouseEnter.bind(this)
		this.handleMouseLeave = this.handleMouseLeave.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseUp = this.handleMouseUp.bind(this)
	}

	componentWillMount() {
		// Set preset message
		var presetMessage = ""
		for (var i = 0; i < this.props.mailAnswers.length; i = i + 4) {
			presetMessage += this.props.mailAnswers[i + 2]
		}

		this.setState({
			presetMessage: presetMessage
		})
	}

	componentDidMount() {
		this.refs.keyEnter.addEventListener('mouseenter', this.handleMouseEnter)
		this.refs.keyEnter.addEventListener('mouseleave', this.handleMouseLeave)
		this.refs.keyEnter.addEventListener('mousedown', this.handleMouseDown)
		this.refs.keyEnter.addEventListener('mouseup', this.handleMouseUp)
	}

	componentWillUnmount() {
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
	        this.endForm()
	    }
	}

	handleTextareaChange(e) {
		this.setState({
			presetMessage: e.target.value
		})
	}

	endForm() {
		var mail = this.refs.mailInput.value
		var body = this.refs.bodyText.value

		if (this.isValidMail(mail)) {
			console.log("valid mail")
			this.setState({
				isMailValid: true
			})

			// Couple question & answers
			var answers = []
			for (var i = 0; i < this.props.mailAnswers.length; i = i + 3) {
				var temp = {
					question : null,
					answer: null
				}
				temp.question = this.props.mailAnswers[i]
				temp.answer = this.props.mailAnswers[i+1]

				answers.push(temp)
			}
			// Set data
			var data = {
				answers: answers,
				bodyText: body,
				mail: mail
			}
			this.sendFormData(data)
			this.props.goToNextStep()
		} else {
			console.log("invalid mail")
			this.setState({
				isMailValid: false
			})
		}
	}

	isValidMail(string) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		this.setState({
			isMailChecked: true
		})
		return re.test(string);
	}

	sendFormData(data) {
		console.log("AJAX MAIL INFORMATIONS")
		console.log(data)

		// let url = 'http://local/HETIC/dataviz-synerghetic/sendMail.php'
		// let url = 'http://lab.theokleman.com/sendMail.php'
		let url = '/sendMail.php'

		qwest.post(url, {
				answers: data.answers,
				body: data.bodyText,
				mail: data.mail,
			})
			.then(function(xhr, response) {
				console.log("success")
			})
			.catch(function(e, xhr, response) {
				console.log("error")
			});
	}

	render() {
		if (!this.state.isMailValid && !this.state.isMailChecked) {
			var inputErrorStyle = {
				opacity: 0
			}
		} else if (!this.state.isMailValid && this.state.isMailChecked) {
			var inputErrorStyle = {
				opacity: 1
			}
		} else {
			var inputErrorStyle = {
				opacity: 0
			}
		}

		// Class selected
		var buttonClass = "key-enter"
		if (this.state.isSelected) {         
		    buttonClass += " selected"
		}

		return(
			<section className="right--mail" ref="sectionMail">
				<div className="content-centered">
					<span>Pour resumer !</span>
					<div className="mail--form">
						<div className="textarea-section">
							<textarea
								placeholder="Remplissez moi !"
								ref="bodyText"
								value={this.state.presetMessage}
								onChange={this.handleTextareaChange.bind(this)}>
								</textarea>
							<div className="input-group">
								<input type="mail" placeholder="Adresse e-mail" ref="mailInput"/>
								<div className="input-error" style={inputErrorStyle}>
									Vous devez renseigner votre e-mail !
								</div>
							</div>
						</div>

						<div className="send-section">
							<button
							    ref="keyEnter"
							    className={buttonClass}
							    >
							    <p>Envoyer</p>
							</button>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
