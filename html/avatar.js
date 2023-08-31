import constants from "./constants.js";
import emitter from "./emitter.js";
import { hs } from "./util.js";

export default class Avatar {
	constructor(username, game) {
		this.username = username;
		this.chute = game.add
			.image(0, 0, "chute")
			.setOrigin(0.5, 1)
			.setVisible(false);
		this.chute.angle =
			Math.random() * constants.MAX_SWAY * (Math.random() < 0.5 ? -1 : 1);
		this.chuteGravity = parseInt(hs.gravity_chute || constants.GRAVITY_CHUTE);
		this.spriteNumber = Math.ceil(Math.random() * constants.NUM_SPRITES);
		this.sprite = game.add
			.image(0, 0, `drop${this.spriteNumber}`)
			.setOrigin(0.5, 0.5)
			.setVisible(false);
		this.label = game.add
			.text(0, -(this.sprite.height / 2) - constants.LABEL_SIZE, username, {
				fontFamily: `"${constants.FONT_FAMILY}"`,
				fontSize: constants.LABEL_SIZE,
				stroke: constants.STROKE_COLOR,
				strokeThickness: constants.STROKE_THICKNESS,
			})
			.setOrigin(0.5, 0);
		this.scoreLabel = game.add
			.text(0, this.sprite.height - constants.SCORE_SIZE, "0", {
				fontFamily: `"${constants.FONT_FAMILY}"`,
				fontSize: constants.SCORE_SIZE,
				stroke: constants.STROKE_COLOR,
				strokeThickness: constants.STROKE_THICKNESS,
			})
			.setOrigin(0.5, 1)
			.setVisible(false);
		this.score = -1;
		this.swayDirection = -1;
		this.active = true;
		this.container = game.add.container();
		this.container.avatar = this;
		game.physics.world.enableBody(this.container);

		if (hs.debug)
			this.rect = game.add
				.rectangle(0, 0, 0, 0)
				.setStrokeStyle(2, 0xff00ff)
				.setOrigin(0.5, 0.5)
				.setDepth(1);

		setTimeout(this.ready.bind(this), 100);
	}

	ready() {
		if (this.container.body == undefined)
			return setTimeout(this.ready.bind(this, game), 100);

		const direction = Math.random() < 0.5 ? -1 : 1;
		const velocity =
			Math.random() *
			(hs.max_velocity ? parseInt(hs.max_velocity) : constants.MAX_VELOCITY) *
			direction;

		this.container.body.pushable = true;
		this.container.body.velocity.x = velocity;
		this.container.body.setSize(this.sprite.width, this.sprite.height, true);
		this.container.setSize(this.sprite.width, this.sprite.height, true);

		if (hs.debug)
			this.rect.setSize(this.container.body.width, this.container.body.height);

		this.container.x = Math.floor(
			this.sprite.width / 2 +
				Math.random() * (constants.SCREEN_WIDTH - this.sprite.width / 2),
		);
		this.container.add(this.chute);
		this.container.add(this.sprite);
		this.container.add(this.label);
		this.container.add(this.scoreLabel);
		this.sprite.visible = true;
		console.debug(`Dropper: ${this.username}`);
		console.debug(`X Velocity: ${this.container.body.velocity.x}`);
		console.debug(`X Position: ${this.container.x}`);
	}

	update() {
		if (!this.container.body) return;

		if (hs.debug) {
			this.rect.setPosition(this.container.body.x, this.container.body.y);
			this.rect.angle = this.container.body.angle;
		}

		if (
			this.container.y + Math.ceil(this.container.height / 2) >=
			constants.SCREEN_HEIGHT
		) {
			return emitter.emit("lose", this);
		}

		if (this.chute.visible) {
			if (this.container.body.velocity.y > this.chuteGravity)
				this.container.body.velocity.y = this.chuteGravity;

			if (
				this.sprite.angle > constants.MAX_SWAY ||
				this.sprite.angle < -constants.MAX_SWAY
			) {
				this.swayDirection = 0 - this.swayDirection;
			}

			this.chute.angle += this.swayDirection / 2;
			this.chute.setPosition(this.sprite.x, this.sprite.y);
		} else if (this.container.body.y >= this.sprite.height) {
			this.chute.visible = true;
		}

		this.sprite.angle = this.chute.angle;
		this.container.angle = 0;
	}
}
