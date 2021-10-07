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
		this.label = game.add.text(0, 0, username,
			{
				fontFamily: '"Syne Mono"',
				fontSize: 18,
				stroke: '#000',
				strokeThickness: 4,
			});
		this.sprite = game.physics.add.image(0, 0, 'drop')
			.setOrigin(0.5, 0.5)
			.setVisible(false);
		this.sprite.avatar = this;
		this.labelOffset = this.sprite.width / 2 - this.label.width / 2;
		this.scoreLabel = null;
		this.score = -1;
		this.swayDirection = -1;
		this.active = true;

		setTimeout(this.ready.bind(this, game), 100);
	}

	ready() {
		if (this.sprite.body == undefined)
			return setTimeout(this.ready.bind(this, game), 100);

		const direction = Math.random() < 0.5 ? -1 : 1;
		const velocity = Math.random() * constants.MAX_RANDOM_VELOCITY * direction;

		this.sprite.body.pushable = true;
		this.sprite.body.velocity.x = velocity;
		this.sprite.body.setSize(this.sprite.width, this.sprite.height, true);
		this.sprite.x = Math.random()
			* (constants.SCREEN_WIDTH - this.sprite.width);
		this.sprite.visible = true;
	}

	update() {
		if (!this.sprite.body) return;

		if (this.sprite.getBottomRight().y >= constants.SCREEN_HEIGHT)
			return emitter.emit('lose', this);

		if (this.chute.visible) {
			this.sprite.body.velocity.y = this.chuteGravity;

			if (this.sprite.angle > constants.MAX_SWAY
				|| this.sprite.angle < -constants.MAX_SWAY)
			{
				this.swayDirection = 0 - this.swayDirection;
			}

			this.sprite.angle += (this.swayDirection / 2);
			this.chute.angle = this.sprite.angle;
			this.chute.setPosition(
				this.sprite.body.x + (this.sprite.width / 2),
				this.sprite.body.y + (this.sprite.height / 2));
		}
		else if (this.sprite.body.y >= this.sprite.body.height) {
			this.sprite.angle = this.chute.angle;
			this.chute.visible = true;
		}

		this.label.setPosition(
			this.sprite.body.x + this.labelOffset,
			this.sprite.body.y - this.label.height - 2);
	}
}
