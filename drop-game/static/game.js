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
		emitter.on('lose', this.onLose, this);
		emitter.on('queuedrop', this.onQueueDrop, this);
		emitter.on('resetdrop', this.onResetDrop, this);
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
			pushable: true,
		});
		this.physics.add.collider(this.dropGroup);

		this.pad.body.immovable = true;
		this.pad.body.allowGravity = false;
		this.pad.body.setSize(this.pad.width, this.pad.height, true);
		this.physics.add.collider(this.pad, this.dropGroup, this.landOnPad.bind(this));
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

	landOnPad (pad, drop) {
		if (!drop.body.touching.down || !pad.body.touching.up)
			return;

		const halfPad = Math.ceil(pad.body.width / 2);
		const halfDrop = Math.ceil(drop.body.width / 2);
		const total = halfPad + halfDrop;
		const pos = Math.abs(
			drop.getCenter().x - pad.getCenter().x);
		const orig = drop;
		const avatar = drop.avatar;

		avatar.active = false;
		avatar.chute.visible = false;
		avatar.score = ((total - pos) / total * 100).toFixed(2);
		avatar.sprite = this.add.image(orig.x, orig.y, 'drop')
			.setOrigin(0.5, 0.5);
		orig.destroy();

		if (this.winner && avatar.score <= this.winner.score)
			return emitter.emit('lose', avatar);

		if (this.winner)
			emitter.emit('lose', this.winner);

		this.winner = avatar;
		avatar.scoreLabel = this.add.text(0, 0, avatar.score,
			{
				fontFamily: '"Syne Mono"',
				fontSize: 26,
				stroke: '#000',
				strokeThickness: 4,
			});
		avatar.scoreLabel.setPosition(
			avatar.sprite.getCenter().x - (avatar.scoreLabel.width / 2),
			avatar.sprite.y + avatar.sprite.height - avatar.scoreLabel.height);
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

	onLose(avatar) {
		const orig = avatar.sprite;

		avatar.chute.visible = false;
		avatar.active = false;
		avatar.label.destroy();
		avatar.label = null;
		avatar.sprite = this.add.image(avatar.sprite.x, avatar.sprite.y, 'drop')
			.setOrigin(0.5, 0.5)
			.setAlpha(0.25);
		avatar.scoreLabel?.destroy();
		avatar.scoreLabel = null;
		this.dropGroup.remove(avatar.sprite);
		orig.destroy();
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
}
