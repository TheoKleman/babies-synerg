import Page from '../Page.js'

export default class About extends Page {
	render() {
		return (
			<section className="page-about" ref="itSelf">
				<h3>About page</h3>
				<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quas placeat, et nostrum ut iure aliquid eaque distinctio adipisci possimus earum, laborum asperiores deserunt, molestias minima saepe. Corporis asperiores non culpa!</p>
				<CloseButton close={this.unmountComponent.bind(this)} />
			</section>
		)
	}
}
