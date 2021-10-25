import constants from './constants.js';
import emitter from './emitter.js';
import qs from './querystring.js';

export default class Avatar {
	constructor(username, game) {
		this.username = username;
		this.chute = game.add.image(0, 0, 'chute')
			.setOrigin(0.5, 1)
			.setVisible(false);
		this.chute.angle = Math.random() * 15 * (Math.random() < 0.5 ? -1 : 1);
		this.chuteGravity = parseInt(qs.gravity_chute || constants.GRAVITY_CHUTE);
		this.spriteNumber = Math.ceil(Math.random() * constants.NUM_SPRITES);
		this.sprite = game.add.image(0, 0, `drop${this.spriteNumber}`)
			.setOrigin(0.5, 0.5)
			.setVisible(false);
		this.label = game.add.text(0, 0, username,
			{
				fontFamily: '"Syne Mono"',
				fontSize: 20,
				stroke: '#000',
				strokeThickness: 6,
			})
			.setOrigin(0.5, 0.5);
		this.scoreLabel = game.add.text(0, 0, '0',
			{
				fontFamily: '"Syne Mono"',
				fontSize: 26,
				stroke: '#000',
				strokeThickness: 6,
			})
			.setOrigin(0.5, 1)
			.setVisible(false);
		this.labelOffset = this.sprite.width / 2 - this.label.width / 2;
		this.score = -1;
		this.swayDirection = -1;
		this.active = true;
		this.container = game.add.container();
		this.container.avatar = this;
		game.physics.world.enableBody(this.container);

		setTimeout(this.ready.bind(this, game), 100);
	}

	ready() {
		if (this.container.body == undefined)
			return setTimeout(this.ready.bind(this, game), 100);

		const direction = Math.random() < 0.5 ? -1 : 1;
		const velocity = Math.random() * constants.MAX_RANDOM_VELOCITY * direction;

		this.container.body.pushable = true;
		this.container.body.velocity.x = velocity;
		this.container.body.setSize(this.sprite.width, this.sprite.height, true);
		this.container.setSize(this.sprite.width, this.sprite.height, true);
		this.container.x = this.sprite.width / 2 + Math.random()
			* (constants.SCREEN_WIDTH - this.sprite.width / 2);
		this.container.add(this.chute);
		this.container.add(this.sprite);
		this.container.add(this.label);
		this.container.add(this.scoreLabel);
		this.sprite.visible = true;
	}

	update() {
		if (!this.container.body) return;

		if (this.container.y + Math.ceil(this.container.height / 2)
			>= constants.SCREEN_HEIGHT)
		{
			return emitter.emit('lose', this);
		}

		if (this.chute.visible) {
			if (this.container.body.velocity.y > this.chuteGravity)
				this.container.body.velocity.y = this.chuteGravity;

			if (this.sprite.angle > constants.MAX_SWAY
				|| this.sprite.angle < -constants.MAX_SWAY)
			{
				this.swayDirection = 0 - this.swayDirection;
			}

			this.chute.angle += (this.swayDirection / 2);
			this.sprite.angle = this.chute.angle;
			this.chute.setPosition(this.sprite.x, this.sprite.y);
		}
		else if (this.container.body.y >= this.sprite.height) {
			this.sprite.angle = this.chute.angle;
			this.chute.visible = true;
		}

		this.container.angle = 0;
		this.label.setPosition(
			this.sprite.x,
			-(this.sprite.height / 2));
	}
}
