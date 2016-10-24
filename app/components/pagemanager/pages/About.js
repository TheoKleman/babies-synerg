import React from 'react'

export default class About extends React.Component {
	constructor() {
		super()
	}

	render() {
		return (
			<section className="page-about page-content">
				<span className="page-title">Synerg'hetic et Les enfants du web </span>
				<div className="credit-group">
					<span className="title">Qu’est-ce qu’une Junior-Entreprise ?</span>
					<p>C’est avant tout une association étudiante implantée dans les universités et établissements d’enseignement supérieur. Elle fonctionne comme une petite entreprise, sur le modèle d’un cabinet de conseil. Les étudiants y mettent en pratique l’enseignement théorique qu’ils reçoivent en réalisant des projets professionnels, pour de véritables clients. Ceux-ci s’initient aux codes, à la culture et aux problématiques d’entreprise. Au contact du client ou travaillant sur son projet, ils sont mis en situation professionnelle avant l’heure.</p>
				</div>
				<div className="credit-group">
					<p>Créée en 2005, Synerg’hetic est la Junior-Entreprise d’HETIC, la grande école de l’Internet. Elle est le reflet de ses étudiants qui entreprennent et observent quotidiennement le Web. Mais c’est aussi un esprit collaboratif pour faire le pont entre la réalité business, technique et créative.</p>
				</div>
				<div className="credit-group">
					<p>Synerg’hetic est la Junior-Entreprise fondée par et pour les étudiants. Génération des enfants du Web, nous sommes conscients des problématiques et des enjeux liés à Internet. Nous évoluons dans cet écosystème au quotidien par passion et vocation. Plus qu’un marché, Internet est un monde générateur de connaissances et de visibilité. Que vous ayez l’envie de refondre votre site ou que vous soyez à la recherche d’un nouveau prestataire web, nous prendrons plaisir à apporter un air frais, créatif et pertinent à vos besoins. Plus que la simple création de sites, nous avons pour volonté de vous intégrer dans cet univers en veillant sur les tendances de demain pour les traduire selon vos besoins et vos objectifs.</p>
				</div>
				<div className="credit-group">
					<a href="http://www.synerghetic.net" target="_blank">www.synerghetic.net</a>
				</div>
			</section>
		)
	}
}
