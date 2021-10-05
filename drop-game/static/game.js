import Avatar from './avatar.js';
import constants from './constants.js';
import emitter from './emitter.js';
import qs from './querystring.js';
import WebFontFile from './webfontfile.js';

/** main game scene */
export default class Game extends Phaser.Scene {
	constructor() {
		super();
		this.active = false;
		this.dropGroup = null;
		this.droppers = {};
		this.endTimer = false;
		this.endWait = (qs.wait || 60) * 1000;
		this.winner = null;

		emitter.on('drop', this.onDrop, this);
		emitter.on('land', this.onLand, this);
		emitter.on('score', this.onScore, this);
	}

	create() {
		this.physics.world.setBounds(
			0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT);
		this.pad = this.physics.add.image(0, 0, 'pad');
		this.pad
			.setMaxVelocity(0, 0)
			.setOrigin(0, 0)
			.setScale(2)
			.setVisible(false)
			.setPosition(0, constants.SCREEN_HEIGHT - this.pad.height * 2);

		setTimeout(this.ready.bind(this), 100);
	}

	ready() {
		if (this.pad.body == undefined)
			return setTimeout(this.ready.bind(this), 100);

		this.dropGroup = this.physics.add.group({
			bounceX: 1,
			bounceY: 1,
			collideWorldBounds: true,
		});
		this.physics.add.collider(this.dropGroup);

		this.pad.body.immovable = true;
		this.pad.body.allowGravity = false;
		this.pad.body.setSize(this.pad.width, this.pad.height, true);
		this.physics.add.collider(this.pad, this.dropGroup,
			(pad, drop) => {
				if (drop.body.touching.down && pad.body.touching.up)
					drop.avatar.winner();
			});
	}

	preload() {
		this.load.addFile(new WebFontFile(this.load, 'Syne Mono'));
		this.load.setBaseURL('/assets');
		this.load.image('drop', 'drop.png');
		this.load.image('pad', 'pad.png');
	}

	update(time, delta) {
		for (let drop of Object.values(this.droppers).filter(v => v.active)) {
			drop.update();

			if (drop.sprite.getBottomRight().y >= constants.SCREEN_HEIGHT)
				drop.loser();
		}
	}

	start() {
		this.active = true;
		this.droppers = {};
		this.pad.x = Math.random()
			* (constants.SCREEN_WIDTH - (this.pad.width * 2));
		this.pad.setVisible(true);
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
		if (!this.active)
			this.start();
		else if (Object.keys(this.droppers).indexOf(username) >= 0)
			return;

		const avatar = new Avatar(username, this);
		this.droppers[username] = avatar;
		this.dropGroup.add(avatar.sprite);
		clearTimeout(this.endTimer);
		this.endTimer = setTimeout(this.end.bind(this), this.endWait);
	}

	onLand(avatar) {
		this.dropGroup.remove(avatar.sprite);
	}

	onScore(avatar) {
		if (this.winner && avatar.score <= this.winner.score)
			return avatar.loser();

		if (this.winner)
			this.winner.loser();

		this.winner = avatar;
	}
}
