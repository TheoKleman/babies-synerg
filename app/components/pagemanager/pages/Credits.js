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
					<p><a href="https://www.linkedin.com/in/mohamed-ali-hazgui-36673196" className="bold" target="_blank">Mohamed-Ali Hazgui</a>	 / Gestion de projet</p>
				</div>
				<div className="credit-group">
					<p><a href="http://theokleman.com/" className="bold" target="_blank">Théo Kleman</a> / Développeur</p>
					<p><a href="http://www.stephenrichard.fr/" className="bold" target="_blank">Stephen Richard</a> / Développeur</p>
				</div>
				<div className="credit-group">
					<p><a href="http://jeannebenichou.com/" className="bold" target="_blank">Jeanne Benichou</a> / Animations</p>
					<p><span className="bold">Maxime Lepaicheux</span> / Animations</p>
					<p><a href="https://www.behance.net/LucaLener" className="bold" target="_blank">Luca Lener</a> / Sound Design</p>
				</div>
				<div className="credit-group">
					<p><a href="https://www.linkedin.com/in/adelmeziani" className="bold" target="_blank">Adel Meziani</a> / Motion Design</p>
					<p><a href="https://www.linkedin.com/in/margaux-cabrol-51a357a4" className="bold" target="_blank">Margaux Cabrol</a> / Voix</p>
					<p><a href="https://www.linkedin.com/in/alexandra-tchoreloff" className="bold" target="_blank">Alexandra Tchoreloff</a> / Contenu</p>
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
