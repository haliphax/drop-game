const GRAVITY = 60;

class Game extends Phaser.Scene {
	constructor() {
		super();
	}

	create() {
		const direction = Math.random() <= 0.5 ? -1 : 1;
		const velocity = Math.random() * 1000 * direction;

		this.physics.world.setBounds(0, 0, 1920, 1080);

		this.dop = this.physics.add.image(0, 0, 'dop');
		this.dop
			.setOrigin(0, 0)
			.setBounce(1)
			.setCollideWorldBounds(true)
			.setMaxVelocity(1000, GRAVITY)
			.setVelocity(velocity, 0);

		this.pad = this.physics.add.image(0, 120, 'pad');
		this.pad.body.allowGravity = false;
		this.pad.body.immovable = true;
		this.pad.x = Math.random() * (1920 - this.pad.width * 2);
		this.pad.y = 1080 - this.pad.height * 2;
		this.pad
			.setOrigin(0, 0)
			.setScale(2);

		this.collider = this.physics.add.collider(
			this.dop,
			this.pad,
			(dop, pad) => {
				if (dop.body.touching.down && pad.body.touching.up) {
					this.add.image(this.dop.x, this.dop.y, 'dop')
						.setOrigin(0, 0)
						.setAlpha(0.5);

					const halfPad = Math.ceil(this.pad.width / 2);
					const halfDop = Math.ceil(this.dop.width / 2);
					const total = halfPad + halfDop;
					const pos = Math.abs(
						(this.dop.x + halfDop) - (this.pad.x + halfPad));
					const score = (total - pos) / total * 100;

					console.log(score);
					this.dop.destroy();
					delete this.dop;
				}
			});
	}

	preload() {
		this.load.setBaseURL('/assets');
		this.load.image('dop', 'dop.png');
		this.load.image('pad', 'trampoline.png');
	}

	update(time, delta) {
		if (this.dop == undefined) return;

		//this.pad.x = this.dop.getCenter().x + (this.dop.width / 2);

		if (this.dop.y > 0
			&& Phaser.Math.Fuzzy.LessThan(this.dop.body.velocity.y, 0, 0.1))
		{
			this.dop.destroy();
			delete this.dop;
		}
	}
}

const game = new Phaser.Game({
	height: 1080,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: {
				y: GRAVITY,
			},
		},
	},
	pixelArt: true,
	render: {
		transparent: true,
	},
	scene: [Game],
	type: Phaser.AUTO,
	width: 1920,
});
