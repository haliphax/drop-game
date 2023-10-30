import { Tweens } from "phaser";
import constants from "./constants";
import { hs } from "./util";

export default class Avatar {
	active: boolean;
	chute: Phaser.GameObjects.Image;
	chuteGravity: integer;
	container: Phaser.GameObjects.Container;
	customImage = false;
	label: Phaser.GameObjects.Text | null;
	rect?: Phaser.GameObjects.Rectangle | null;
	score: integer;
	scoreLabel: Phaser.GameObjects.Text | null;
	sprite: Phaser.GameObjects.Image;
	swayTween: Tweens.Tween | null = null;
	username: string;

	constructor(username: string, game: Phaser.Scene, emote?: string) {
		this.username = username;
		this.chute = game.add
			.image(0, 0, "chute")
			.setOrigin(0.5, 1)
			.setVisible(false);
		this.chuteGravity = parseInt(hs.gravity_chute || constants.GRAVITY_CHUTE);

		if (emote) {
			this.customImage = true;
			this.sprite = game.add.image(0, 0, emote);
			this.sprite.setDisplaySize(64, 64);
			this.chute.setOrigin(0.5, 0.75);
		} else {
			const spriteNumber = Math.ceil(Math.random() * constants.NUM_SPRITES);
			this.sprite = game.add.image(0, 0, `drop${spriteNumber}`);
		}

		this.sprite.setOrigin(0.5, 0.5).setVisible(false);
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
		this.active = true;
		this.container = game.add.container();
		this.container.setData("avatar", this);
		this.container.setSize(this.sprite.displayWidth, this.sprite.displayHeight);
		game.physics.world.enableBody(this.container);

		if (hs.debug) {
			this.rect = game.add
				.rectangle(0, 0, 0, 0)
				.setStrokeStyle(2, 0xff00ff)
				.setOrigin(0, 0)
				.setDepth(1);
		}

		setTimeout(this.ready.bind(this), 100);
	}

	ready(): void {
		if (this.container.body == undefined) {
			setTimeout(this.ready.bind(this), 100);
			return;
		}

		const body = this.container.body as Phaser.Physics.Arcade.Body;
		body.setBounce(0.9, 0);
		body.collideWorldBounds = true;
		body.onWorldBounds = true;

		const direction = Math.random() < 0.5 ? -1 : 1;
		const velocity =
			Math.random() *
			(hs.max_velocity ? parseInt(hs.max_velocity) : constants.MAX_VELOCITY) *
			direction;

		body.pushable = true;
		body.velocity.x = velocity;
		body.setSize(this.sprite.displayWidth, this.sprite.displayHeight, true);
		this.rect?.setSize(body.width, body.height);

		this.container.x = Math.floor(
			this.sprite.width / 2 +
				Math.random() * (constants.SCREEN_WIDTH - this.sprite.width / 2),
		);
		this.container.add(this.chute);
		this.container.add(this.sprite);
		this.container.add(this.label!);
		this.container.add(this.scoreLabel!);
		this.sprite.visible = true;
		console.debug(`Dropper: ${this.username}`);
		console.debug(`X Velocity: ${this.container.body.velocity.x}`);
		console.debug(`X Position: ${this.container.x}`);
	}

	update() {
		if (!this.container.body) return;

		const body = this.container.body as Phaser.Physics.Arcade.Body;

		this.container.angle = 0;
		body.angle = 0;

		if (hs.debug && this.rect) {
			this.rect.setPosition(body.x, body.y);
		}

		if (this.chute.visible) {
			if (this.container.body.velocity.y > this.chuteGravity) {
				this.container.body.velocity.y = this.chuteGravity;

				if (this.swayTween!.paused) {
					this.swayTween!.resume();
				}
			} else if (
				this.container.body.velocity.y < this.chuteGravity &&
				!this.swayTween!.paused
			) {
				this.swayTween!.pause();
			}
		} else if (body.y >= this.sprite.height) {
			this.swayTween = this.sprite.scene.add.tween({
				duration: 2000,
				props: {
					angle: {
						getEnd() {
							return constants.MAX_SWAY;
						},
						getStart() {
							return -constants.MAX_SWAY;
						},
					},
				},
				repeat: -1,
				targets: this.chute,
				yoyo: true,
			});
			this.chute.visible = true;
		}

		this.sprite.angle = this.chute.angle;
	}
}
