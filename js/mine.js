class MineParticle {
	constructor(x, y) {
		//particle body (IT IS A SQUARE)
		this.side = MINE_PARTICLE_SIDE;

		//particle info
		this.x = x;
		this.y = y;
		this.angle = (Math.floor(Math.random() * 360)) * Math.PI / 180;
		this.speed = 20;
		this.opacity = 1;
		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;

		//delete particle
		this.explode = false;

		//RED, ORANGE, GREY
		this.possibleColors = ["#ED4245", "#FFA500", "#808080"];
		this.color = this.possibleColors[Math.floor(Math.random() * this.possibleColors.length)];
	}

	update() {
		//GOAL: Make particle explode outwards, twisting the angle to follow a radius of 30

		//update particle position
		this.angle += 5 * Math.PI / 180;
		
		this.x += this.speed * Math.cos(this.angle);
		this.y += this.speed * Math.sin(this.angle);

		this.centerX = this.x + this.side / 2;
		this.centerY = this.y + this.side / 2;
	
		this.speed /= 1.2;
		this.opacity -= 0.04;

		//update color
		this.fillStyle = hexToRgbA(this.color, this.opacity);

		//console.log(this.opacity)

		if (this.opacity <= 0) {
			this.explode = true;
		}
	}

	render() {
		//RENDER PARTICLE
		ctx.shadowBlur = 5;
		ctx.shadowColor = this.color;
		ctx.save();

		ctx.translate(this.centerX, this.centerY);
		ctx.rotate(this.angle);

		//color in rgba to support opacity
		ctx.fillStyle = hexToRgbA(this.color, this.opacity);
		ctx.fillRect(this.side / -2, this.side / -2, this.side, this.side);

		ctx.restore();
		ctx.shadowBlur = 0;
	}
}

class Mine {
	constructor(x, y, tankID) {
		//mine body
		this.radius = MINE_RADIUS;
		this.explosionRadius = MINE_EXPLOSION_RADIUS;

		//tankID
		this.tankID = tankID;

		//light yellow
		this.color = "#FEE75C";
		//light red
		this.flashingColor = "#ED4245";
		//current color to render
		this.currentColor = this.color;

		//mine particles
		this.mineParticles = [];

		//mine info
		this.x = x;
		this.y = y;

		//mine particle delay
		this.particleDelay = 0;

		//countdown for mine to explode
		this.countdown = 200;

		//color countdown
		this.colorCountdown = 5;

		//once mine explodes, the fuse keeps it exploding until it runs out and deletes
		this.fuse = 50;

		//is this mine exploding, countdown has hit 0
		this.exploding = false;

		//this mine has finished exploding, delete
		this.explode = false;
	}

	update() {
		//update countdown
		this.countdown -= 1;

		//update mine explosion particles
		for (var i = 0; i < this.mineParticles.length; i++) {
			const mineParticle = this.mineParticles[i];

			//DELETE PARTICLE
			if (mineParticle.explode) {
				this.mineParticles.splice(i, 1);
				continue;
			}

			mineParticle.update();
		}

		//if mine is within 100 milliseconds of exploding start flashing
		if (this.countdown <= 100) {
			this.colorCountdown -= 1;

			if (this.colorCountdown <= 0) {
				//a little delay for flashing
				this.colorCountdown = 5;

				if (this.currentColor == this.color) {
					this.currentColor = this.flashingColor;
				} else {
					this.currentColor = this.color;
				}
			}
		}

		if (this.exploding) {
			//mine is in the process of exploding
			this.fuse -= 1;

			this.particleDelay++;

			if (this.particleDelay > 1 && this.fuse > 20) {
				this.particleDelay = 0;

				//create 50 mine explosion particles
				for (var i = 0; i < 50; i++) {
					this.mineParticles.push(new MineParticle(this.x - MINE_PARTICLE_SIDE / 2, this.y - MINE_PARTICLE_SIDE / 2));
				}
			}

			if (this.fuse <= 0) {
				//explosion has runout and no more particles, delete mine
				this.explode = true;
			}
		} else if (this.countdown <= 0) {
			//execute explosion, countdown has ended
			this.exploding = true;
		}
	}

	render() {
		//render mine particles
		for (var i = 0; i < this.mineParticles.length; i++) {
			this.mineParticles[i].render();
		}

		if (!this.exploding) {
			ctx.shadowBlur = 5;
			ctx.shadowColor = this.currentColor;
			ctx.fillStyle = this.currentColor;
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
			ctx.fill();
			ctx.shadowBlur = 0;
		}
	}

	renderShadow() {
		if (!this.exploding) {
			ctx.fillStyle = SHADOW;
			ctx.beginPath();
			ctx.arc(this.x - 5, this.y + 5, this.radius, 0, 2 * Math.PI, false);
			ctx.fill();
		}
	}
}