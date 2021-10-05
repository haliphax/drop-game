import constants from './constants.js';
import emitter from './emitter.js';

export default class Avatar {
	constructor(username, game) {
		this.username = username;
		this.game = game;
		this.label = game.add.text(0, 0, username,
			{
				fontFamily: '"Syne Mono"',
				fontSize: 18,
				stroke: '#000',
				strokeThickness: 2,
			});
		this.sprite = game.physics.add.image(0, 0, 'drop');
		this.labelOffset = this.sprite.width / 2 - this.label.width / 2;
		this.scoreLabel = null;
		this.score = -1;
		this.active = true;

		this.sprite
			.setOrigin(0, 0)
			.setMaxVelocity(1000, constants.GRAVITY)
			.setVisible(false);

		setTimeout(this.ready.bind(this, game), 100);
	}

	ready() {
		if (this.sprite.body == undefined)
			return setTimeout(this.ready.bind(this, game), 100);

		const direction = Math.random() <= 0.5 ? -1 : 1;
		const velocity = Math.random() * 1000 * direction;

		this.sprite.body.velocity.x = velocity;
		this.sprite.body.setSize(this.sprite.width, this.sprite.height, true);
		this.sprite.x = Math.random()
			* (constants.SCREEN_WIDTH - this.sprite.width);
		this.sprite.visible = true;

		this.game.physics.add.collider(
			this.sprite,
			this.game.pad,
			(drop, pad) => {
				if (drop.body.touching.down && pad.body.touching.up)
					this.winner();
			});
	}

	update() {
		if (!this.sprite.body) return;

		this.label.setPosition(
			this.sprite.body.x + this.labelOffset,
			this.sprite.body.y - this.label.height - 2);
	}

	loser() {
		this.active = false;
		this.label.destroy();
		this.label = null;
		const orig = this.sprite;
		this.sprite = this.game.add.image(this.sprite.x, this.sprite.y, 'drop')
			.setOrigin(0, 0)
			.setAlpha(0.25);
		orig.destroy();

		if (this.scoreLabel !== null) {
			this.scoreLabel.destroy();
			this.scoreLabel = null;
		}
	}

	winner() {
		const halfPad = Math.ceil(this.game.pad.body.width / 2);
		const halfDrop = Math.ceil(this.sprite.body.width / 2);
		const total = halfPad + halfDrop;
		const pos = Math.abs(
			this.sprite.getCenter().x - this.game.pad.getCenter().x);
		const orig = this.sprite;

		this.score = ((total - pos) / total * 100).toFixed(2);
		this.sprite =
			this.game.add.image(
				this.sprite.x,
				this.sprite.y, 'drop')
			.setOrigin(0, 0);
		orig.destroy();

		this.scoreLabel = this.game.add.text(0, 0, this.score,
			{
				fontFamily: '"Syne Mono"',
				fontSize: 26,
				stroke: '#000',
				strokeThickness: 2,
			});
		this.scoreLabel.setPosition(
			this.sprite.getCenter().x - this.scoreLabel.width / 2,
			this.sprite.y + this.sprite.height - this.scoreLabel.height);
		this.active = false;
		emitter.emit('score', this);
	}
}
