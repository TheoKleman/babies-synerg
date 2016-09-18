import React from 'react'
import Draggable from 'react-draggable'
import GSAP from 'gsap'
import SpriteAnimator from 'react-sprite-animator'
var interact = require('interact.js')
var classNames = require('classnames')

export default class BabyResponsive extends React.Component {
	constructor() {
		super()

		this.state = {
			isDragging: false,
			isMooving: false
		}

		this.rotateAngleLimit = 40
	}

	componentDidMount() {
		this.enableDrag()
	}

	enableDrag() {
		interact(this.refs.itSelf).draggable({
			inertia: {
				true
			},
			restrict: {
				restriction: document.getElementById('responsive'),
				elementRect: { top: 0, left: 0, bottom: 1.5, right: 1.5 }
			},
			onmove: this.onDragListener.bind(this),
			onend: this.onDragStop.bind(this),
			// pointerMoveTolerance: 10
		})
	}

	onDragListener(event) {
		var self = this

		this.setState({
			isDragging: true,
			isMooving: true
		})

		TweenMax.set(this.refs.babyPieces, {
			opacity: 1
		})

		var baseX = 0,
			baseY = 0 - 40

		var boardWidth = document.getElementById('responsive').clientWidth,
			boardHeight = document.getElementById('responsive').clientHeight,
			viewportWidth = window.innerWidth,
			viewportHeight = window.innerHeight

		var target = event.target,
		    // keep the dragged position in the data-x/data-y attributes
		    x = (parseFloat(target.getAttribute('data-x')) || baseX) + event.dx,
		    y = (parseFloat(target.getAttribute('data-y')) || baseY) + event.dy;

		// Rotate baby here //
		this.makeBabyRotate(x)

		// translate the element
		target.style.webkitTransform =
		target.style.transform =
		  'translate(' + (x) + 'px, ' + (y) + 'px)';

		// update the posiion attributes
		target.setAttribute('data-x', x);
		target.setAttribute('data-y', y);
	}

	onDragStop(event) {
		this.setState({
			transform: "rotate(0deg)",
			transformArms: "rotate(0deg)",
		})

		this.setState({
			isDragging: false,
			isMooving: false,
		})

		TweenMax.set(this.refs.babyPieces, {
			opacity: 0
		})
	}

	rotateBaby(direction, rotateAngleLimit) {
		var angle = 0

		if(direction > this.state.savedX) {
			angle = direction - this.state.savedX
			this.state.savedX = direction
			if(angle > rotateAngleLimit) {
				angle = rotateAngleLimit
				return angle
			} else {
				return angle
			}
		} else {
			angle = direction - this.state.savedX
			this.state.savedX = direction
			if(angle < -rotateAngleLimit) {
				angle = -rotateAngleLimit
				return angle
			} else {
				return angle
			}
		}
	}

	makeBabyRotate(direction) {
		var babyRotation = this.rotateBaby(direction, this.rotateAngleLimit)

		this.refs.itSelf.style.transform = "rotate("+babyRotation+"deg)"

		this.setState({
			transform: "rotate("+babyRotation+"deg)",
			transformArms: "rotate("+babyRotation+"deg)",
		})
	}

	render() {

		var piecesClasses = classNames({
			'baby-pieces': true,
			'moving': this.state.isDragging,
		})

		var bodyAnimationClasses = classNames({
			'baby-bg': true,
			'moving': this.state.isDragging,
		})

		var animator = <SpriteAnimator
						ref="bodyAnimation"
						className={bodyAnimationClasses}
						sprite="/images/sprites/blue/head1/anim3/animation.png"
						width={200}
						height={200}
						timeout={70}
						shouldAnimate={true}
						stopLastFrame={true} />

		return(
			<div
				className="baby"
				ref="itSelf">
				<div className="the-baby">
					{animator}
					<div ref="babyPieces" className={piecesClasses}>
						<span className="baby-body"><img src="/images/sprites/blue/head1/baby-body.png" alt="baby body"/></span>
						<span ref="armRight" className="baby-arm-right" style={{transform: this.state.transformArms}}><img src="/images/right-arm.png" alt="baby right arm"/></span>
						<span ref="armLeft" className="baby-arm-left" style={{transform: this.state.transformArms}}><img src="/images/left-arm.png" alt="baby left arm"/></span>
						<span ref="legRight" className="baby-leg-right" style={{transform: this.state.transformArms}}><img src="/images/right-leg.png" alt="baby right leg"/></span>
						<span ref="legLeft" className="baby-leg-left" style={{transform: this.state.transformArms}}><img src="/images/left-leg.png" alt="baby left leg"/></span>
					</div>
				</div>
			</div>
		);
	}
}