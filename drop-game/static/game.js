import constants from './constants.js';
import emitter from './emitter.js';
import Avatar from './avatar.js';
import WebFontFile from './webfontfile.js';

/** main game scene */
export default class Game extends Phaser.Scene {
	constructor() {
		super();
		this.sinceDrop = 0;
		this.droppers = {};
		this.winner = null;
		this.active = false;
		this.endTimer = false;
	}

	create() {
		emitter.on('drop', this.onDrop, this);
		emitter.on('score', this.onScore, this);
		this.physics.world.setBounds(0, 0, 1920, 1080);
		this.pad = this.physics.add.image(0, 0, 'pad');
		this.pad
			.setOrigin(0, 0)
			.setScale(2)
			.setVisible(false)
			.setPosition(0, 1080 - this.pad.height * 2);

		function setPadBody() {
			if (this.pad.body == undefined) return setTimeout(setPadBody, 100);
			this.pad.setMaxVelocity(0, 0);
			this.pad.body.allowGravity = false;
			this.pad.body.immovable = true;
			this.pad.body.setSize(this.pad.width, this.pad.height, true);
		}

		setTimeout(setPadBody.bind(this), 100);
	}

	preload() {
		this.load.addFile(new WebFontFile(this.load, 'Syne Mono'));;
		this.load.setBaseURL('/assets');
		this.load.image('drop', 'drop.png');
		this.load.image('pad', 'pad.png');
	}

	update(time, delta) {
		for (let drop of Object.values(this.droppers).filter(v => v.active)) {
			drop.update();

			if (drop.sprite.getBottomRight().y >= 1079)
				drop.loser();
		}
	}

	end() {
		this.active = false;
		this.pad.setVisible(false);

		for (let drop of Object.values(this.droppers)) {
			drop.sprite.destroy();
			if (drop.scoreLabel) drop.scoreLabel.destroy();
			if (drop.label) drop.label.destroy();
		}
	}

	// events

	onDrop(username) {
		if (!this.active) {
			this.active = true;
			this.droppers = {};
			this.pad.x = Math.random() * (1920 - this.pad.width * 2);
			this.pad.setVisible(true);
		}
		else if (Object.keys(this.droppers).indexOf(username) >= 0) {
			return;
		}

		this.droppers[username] = new Avatar(username, this);

		clearTimeout(this.endTimer);
		this.endTimer = setTimeout(
			this.end.bind(this),
			constants.WAIT_UNTIL_RESET);
	}

	onScore(avatar) {
		if (this.winner !== null && avatar.score <= this.winner.score)
			return avatar.loser();

		for (let drop of Object.values(this.droppers)
			.filter(v => v.username != avatar.username && v.score >= 0))
		{
			drop.loser();
		}

		this.winner = avatar;
	}
}
