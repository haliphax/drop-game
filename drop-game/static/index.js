const GRAVITY = 60;

const qs = Object.fromEntries(
	window.location.href.split('?')[1].split('&').map(v => v.split('=')));
const twitch = new tmi.Client({
	channels: [qs.channel],
	identity: {
		username: qs.username,
		password: `oauth:${qs.oauth}`,
	},
});

const emitter = new Phaser.Events.EventEmitter();

class Game extends Phaser.Scene {
	constructor() {
		super();
	}

	create() {
		emitter.on('drop', this.onDrop, this);
		this.physics.world.setBounds(0, 0, 1920, 1080);
		this.pad = this.physics.add.image(0, 120, 'pad');
		this.pad.body.allowGravity = false;
		this.pad.body.immovable = true;
		this.pad.x = Math.random() * (1920 - this.pad.width * 2);
		this.pad.y = 1080 - this.pad.height * 2;
		this.pad
			.setOrigin(0, 0)
			.setScale(2);
	}

	preload() {
		this.load.setBaseURL('/assets');
		this.load.image('drop', 'drop.png');
		this.load.image('pad', 'pad.png');
	}

	update(time, delta) {
		if (this.drop == undefined) return;

		if (this.drop.y > 0
			&& Phaser.Math.Fuzzy.LessThan(this.drop.body.velocity.y, 0, 0.1))
		{
			this.drop.destroy();
			delete this.drop;
		}
	}

	// events

	onDrop() {
		if (this.drop != undefined) return;

		const direction = Math.random() <= 0.5 ? -1 : 1;
		const velocity = Math.random() * 1000 * direction;

		this.drop = this.physics.add.image(0, 0, 'drop');
		this.drop
			.setOrigin(0, 0)
			.setBounce(1)
			.setCollideWorldBounds(true)
			.setMaxVelocity(1000, GRAVITY)
			.setVelocity(velocity, 0);
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

const dropCommandRgx = /^\!drop(?:\s*([^ ]+)?)/i;
twitch.on('message', (channel, tags, message, self) => {
	if (self || !dropCommandRgx.exec(message)) return;

	emitter.emit('drop');
});

twitch.connect();
