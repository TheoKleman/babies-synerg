import React from 'react'
import qwest from 'qwest'

export default class MailStep extends React.Component {
	constructor() {
		super()

		this.state = {
			isMailValid: false,
			isMailChecked: false,
			presetMessage: ""
		}
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
		var tl = new TimelineMax()
		tl.to(this.refs.sectionMail, 0, {
			alpha: 0,
			ease: Power2.easeOut,
		})
		tl.to(this.refs.sectionMail, .25, {
			alpha: 1,
			ease: Power2.easeOut,
		})
	}

	handleTextareaChange(e) {
		this.setState({
			presetMessage: e.target.value
		})
	}

	endForm() {
		var self = this
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
			// this.props.hideForm()

			// setTimeout(function(){
			//     self.props.resetForm()
			// }, 500)
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
								className="key-enter"
								onClick={this.endForm.bind(this)}></button>
						</div>
					</div>
				</div>
			</section>
		);
	}
}
