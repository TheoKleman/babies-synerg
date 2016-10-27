import React from 'react'

export default class Credits extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<section className="page-credits page-content">
				<span className="page-title">Eux aussi sont des enfants du web</span>
				<div className="credit-group">
					<p><span className="bold">Mohamed-Ali Hazgui</span>	 / Gestion de projet</p>
				</div>
				<div className="credit-group">
					<p><span className="bold">Théo Kleman</span> / Développeur</p>
					<p><span className="bold">Stephen Richard</span> / Développeur</p>
				</div>
				<div className="credit-group">
					<p><span className="bold">Maxime Lepaicheux</span> / Animations</p>
					<p><span className="bold">Luca Lener</span> / Sound Design</p>
				</div>
				<div className="credit-group">
					<p><span className="bold">Adel Meziani</span> / Motion Design</p>
					<p><span className="bold">Margaux Cabrol</span> / Voix</p>
					<p><span className="bold">Alexandra Tchoreloff</span> / Contenu</p>
				</div>
				<div className="credit-group">
					<p><a href="http://www.synerghetic.net" className="bold" target="_blank">HETIC</a> / www.hetic.net</p>
					<p><a href="http://www.synerghetic.net" className="bold" target="_blank">SYNERG'HETIC</a> / www.synerghetic.net</p>
				</div>
				<div className="credit-group">
					<p className="credits-mentions">Musiques utilisées / <a href="https://www.youtube.com/watch?v=QH2-TGUlwu4" target="_blank">Nyan Cat</a>, <a href="https://www.youtube.com/watch?v=LBjUh4bYF8w" target="_blank">Daadidooo dadou didooou</a></p>
				</div>
			</section>
		)
	}
}
