import Avatar from './avatar.js';
import constants from './constants.js';
import emitter from './emitter.js';
import qs from './querystring.js';
import { twitch } from './twitch.js';
import WebFontFile from './webfontfile.js';

/** main game scene */
export default class Game extends Phaser.Scene {
	constructor() {
		super();
		this.active = false;
		this.dropGroup = null;
		this.droppers = {};
		this.droppersArray = [];
		this.droppersQueue = {};
		this.endTimer = false;
		this.endWait = (qs.wait || constants.WAIT_FOR_RESET) * 1000;
		this.queue = false;
		this.winner = null;

		emitter.on('drop', this.onDrop, this);
		emitter.on('land', this.onLand, this);
		emitter.on('queuedrop', this.onQueueDrop, this);
		emitter.on('resetdrop', this.onResetDrop, this);
		emitter.on('score', this.onScore, this);
		emitter.on('startdrop', this.onStartDrop, this);
	}

	create() {
		this.physics.world
			.setBounds(0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT)
			.setBoundsCollision(true, true, false, false);
		this.pad = this.physics.add.image(0, 0, 'pad');
		this.pad
			.setMaxVelocity(0, 0)
			.setOrigin(0, 0)
			.setScale(constants.PAD_SCALE)
			.setVisible(false)
			.setPosition(
				0, constants.SCREEN_HEIGHT - this.pad.height * constants.PAD_SCALE);

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
		for (let drop of this.droppersArray)
			if (drop.active) drop.update();
	}

	start() {
		this.active = true;
		this.droppers = {};
		this.droppersArray = [];
		this.winner = null;
		this.pad.x = Math.random()
			* (constants.SCREEN_WIDTH - (this.pad.width * constants.PAD_SCALE));
		this.pad.setVisible(true);

		if (this.queue)
			this.droppersQueue = {};
	}

	end() {
		this.active = false;
		this.queue = false;
		this.pad.setVisible(false);

		for (let drop of this.droppersArray) {
			drop.sprite.destroy();
			drop.scoreLabel?.destroy();
			drop.label?.destroy();
		}
	}

	resolveQueue() {
		for (let dropper of Object.keys(this.droppersQueue))
			emitter.emit('drop', dropper, true);
	}

	// events

	onDrop(username, queue = false) {
		if (!this.active)
			this.start();
		else if (this.queue && !queue
			&& this.droppersQueue.hasOwnProperty(username))
		{
			return;
		}
		else if (!this.queue && this.droppers.hasOwnProperty(username))
			return;

		if (this.queue && !queue) {
			this.droppersQueue[username] = true;
			return;
		}

		const avatar = new Avatar(username, this);
		this.droppers[username] = avatar;
		this.droppersArray.push(avatar);
		this.dropGroup.add(avatar.sprite);
		clearTimeout(this.endTimer);
		this.endTimer = setTimeout(this.end.bind(this), this.endWait);
	}

	onLand(avatar) {
		this.dropGroup.remove(avatar.sprite);
	}

	onQueueDrop(delay = null) {
		if (this.queue) {
			twitch.say(qs.channel, 'A queue is already forming!');
			return;
		}

		this.queue = true;

		if (delay !== null)
			setTimeout(this.resolveQueue.bind(this), delay * 1000);

		twitch.say(qs.channel, 'Queue started!');
	}

	onResetDrop() {
		this.end();
	}

	onStartDrop() {
		this.resolveQueue();
	}

	onScore(avatar) {
		if (this.winner && avatar.score <= this.winner.score)
			return avatar.loser();

		if (this.winner)
			this.winner.loser();

		this.winner = avatar;
	}
}
