import React from 'react';

export default class Loader extends React.Component {
	constructor() {
		super()
	}

	render() {
		return(
			<div className="page page-loader">
				<div className="page-content">
					<img className="baby-synerg" src="./images/synerg-baby-placeholder.png" alt="Synerg hetic la junior entreprise des enfants du web" />
					<h1>Chargement en cours</h1>
					<div className="nav-explanation">
						<img src="./images/nav-buttons.png" alt="Comment se déplacer sur le site" />
						<p>Faites connaissance avec les enfants du web de Synerg’hetic</p>
					</div>
				</div>
			</div>
		)
	}
}