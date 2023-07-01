import React from 'react'

class Canvas extends React.Component {
	constructor(props) {
		super(props)
		this.canvasRef = React.createRef()
	}

	componentDidMount() {
		const canvas = this.canvasRef.current
		const ctx = canvas.getContext('2d')
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
		const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
		gradient.addColorStop(0, 'magenta')
		gradient.addColorStop(0.5, 'black')
		gradient.addColorStop(1, 'magenta')
		ctx.fillStyle = gradient
		ctx.strokeStyle = 'black'

		////////////////////   make a particle   ///////////////
		class Particle {
			constructor(effect) {
				this.effect = effect
				this.radius = 2.5
				this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
				this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)

				this.opacity = 0.5
				this.vx = Math.random() * 1 - 0.5
				this.vy = Math.random() * 1 - 0.5
			}

			draw(context) {
				context.beginPath()
				context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
				context.fillStyle = 'hsl(' + +', 100%, 50%)'
				context.fill()
			}
			update() {
				this.x -= this.vx
				if (this.x > this.effect.width || this.x < this.radius) this.vx *= -1
				this.y -= this.vy
				if (this.y > this.effect.height || this.y < this.radius) this.vy *= -1
				this.opacity -= 0.01
				if (this.opacity < 0) this.opacity = 0
			}
			reset() {
				this.x = this.radius + Math.random() * (this.effect.width - this.radius * 2)
				this.y = this.radius + Math.random() * (this.effect.height - this.radius * 2)
				this.opacity = 0.5
			}
		}

		//////////////////   defined canvas   ////////////

		class Effect {
			constructor(canvas) {
				this.canvas = canvas
				this.width = canvas.width
				this.height = canvas.height
				this.particles = []
				this.numberOfParticles = 6
				this.createParticles()
				window.addEventListener('resize', (e) => {
					this.resize(window.innerHeight, window.innerWidth)
				})
			}

			createParticles() {
				for (let i = 0; i < this.numberOfParticles; i++) {
					const particle = new Particle(this)
					this.particles.push(particle)
				}
			}
			handleParticle(context) {
				this.connectParticles(context)
				this.particles.forEach((particle) => {
					particle.draw(context)
					particle.update()
				})
			}
			connectParticles(context) {
				const maxDistance = 400
				for (let a = 0; a < this.particles.length; a++) {
					for (let b = a; b < this.particles.length; b++) {
						const dx = this.particles[a].x - this.particles[b].x
						const dy = this.particles[a].y - this.particles[b].y
						const distance = Math.hypot(dx, dy)
						if (distance < maxDistance) {
							const opacity = 1 - distance / maxDistance
							context.globalAlpha = opacity
							context.beginPath()
							context.moveTo(this.particles[a].x, this.particles[a].y)
							context.lineTo(this.particles[b].x, this.particles[b].y)
							context.stroke()
						}
					}
				}
			}
			resize(height, width) {
				this.canvas.height = height
				this.canvas.width = width
				this.width = width
				this.height = height
				const gradient = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height)
				gradient.addColorStop(0, 'magenta')
				gradient.addColorStop(0.5, 'black')
				gradient.addColorStop(1, 'magenta')
				ctx.fillStyle = gradient
				ctx.strokeStyle = 'magenta'
				this.particles.forEach((particle) => {
					particle.reset()
				})
			
			}
		}
		const effect = new Effect(canvas)

		///////////////////////   animate   /////////////////

		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			effect.handleParticle(ctx)
			requestAnimationFrame(animate)
		}
		animate()
	}

	render() {
		return <canvas ref={this.canvasRef} className='canvas' />
	}
}

export default Canvas
