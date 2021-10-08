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
		emitter.on('droplow', this.onDropLow, this);
		emitter.on('droprecent', this.onDropRecent, this);
		emitter.on('droptop', this.onDropTop, this);
		emitter.on('lose', this.onLose, this);
		emitter.on('queuedrop', this.onQueueDrop, this);
		emitter.on('resetdrop', this.onResetDrop, this);
		emitter.on('startdrop', this.onStartDrop, this);
	}

	preload() {
		this.load.addFile(new WebFontFile(this.load, 'Syne Mono'));
		this.load.setBaseURL('./assets/default');
		this.load.image('chute', 'chute.png');
		this.load.image('drop1', 'drop1.png');
		this.load.image('drop2', 'drop2.png');
		this.load.image('drop3', 'drop3.png');
		this.load.image('drop4', 'drop4.png');
		this.load.image('drop5', 'drop5.png');
		this.load.image('pad', 'pad.png');
	}

	create() {
		this.physics.world
			.setBounds(0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT)
			.setBoundsCollision(true, true, false, false);
		this.pad = this.physics.add.image(0, 0, 'pad');
		this.pad
			.setMaxVelocity(0, 0)
			.setOrigin(0, 0)
			.setVisible(false)
			.setPosition(0, constants.SCREEN_HEIGHT - this.pad.height);

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
		this.physics.add.collider(
			this.dropGroup, this.dropGroup, this.crash.bind(this));;

		this.pad.body.immovable = true;
		this.pad.body.allowGravity = false;
		this.pad.body.setSize(this.pad.width, this.pad.height, true);
		this.physics.add.collider(
			this.pad, this.dropGroup, this.landOnPad.bind(this));
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
		this.pad.x = Math.random() * (constants.SCREEN_WIDTH - this.pad.width);
		this.pad.setVisible(true);

		if (this.queue)
			this.droppersQueue = {};
	}

	end() {
		this.active = false;
		this.queue = false;
		this.pad.setVisible(false);

		for (let drop of this.droppersArray) {
			drop.chute.destroy();
			drop.sprite.destroy();
			drop.scoreLabel?.destroy();
			drop.label?.destroy();
		}
	}

	resolveQueue() {
		for (let dropper of Object.keys(this.droppersQueue))
			emitter.emit('drop', dropper, true);
	}

	crash (a, b) {
		for (let sprite of [a, b])
			sprite.body.velocity.y = -1 * (
				(Math.random() * constants.BUMP_MIN) + constants.BUMP_SPREAD);
	}

	landOnPad (pad, drop) {
		if (!drop.body.touching.down || !pad.body.touching.up)
			return;

		const halfPad = Math.ceil(pad.body.width / 2);
		const halfDrop = Math.ceil(drop.body.width / 2);
		const total = halfPad + halfDrop;
		const pos = Math.abs(drop.x - pad.getCenter().x);
		const orig = drop;
		const avatar = drop.avatar;

		avatar.active = false;
		avatar.chute.visible = false;
		avatar.score = ((total - pos) / total * 100).toFixed(2);
		avatar.sprite =
			this.add.image(orig.x, orig.y, `drop${avatar.spriteNumber}`)
				.setOrigin(0.5, 0.5);
		orig.destroy();

		const now = Date.now();
		const expiry = now - constants.TWENTY_FOUR_HOURS;
		const allRecent = JSON.parse(localStorage.getItem('recent') || '{}');
		const recentKeys = Object.keys(allRecent);

		if (recentKeys.length >= constants.TRACK_RECENT
			&& recentKeys.indexOf(avatar.username) < 0)
		{
			let oldest = null;

			for (let key of recentKeys) {
				const v = allRecent[key];

				if (oldest === null || v[1] < allRecent[oldest][1])
					oldest = key;
			}

			delete allRecent[oldest];
		}

		allRecent[avatar.username] = [avatar.score, now];
		localStorage.setItem('recent', JSON.stringify(allRecent));

		const record = [avatar.username, avatar.score, now];
		const topScore = JSON.parse(localStorage.getItem('top') || 'null');

		if (topScore === null
			|| topScore[2] < expiry
			|| avatar.score > topScore[1])
		{
			localStorage.setItem('top', JSON.stringify(record));
		}

		const lowScore = JSON.parse(localStorage.getItem('low') || 'null');

		if (lowScore === null
			|| lowScore[2] < expiry
			|| avatar.score < lowScore[1])
		{
			localStorage.setItem('low', JSON.stringify(record));
		}

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
				strokeThickness: 6,
			});
		avatar.scoreLabel.setPosition(
			avatar.sprite.getCenter().x - (avatar.scoreLabel.width / 2),
			avatar.sprite.getBottomRight().y - avatar.scoreLabel.height);
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

	onDropLow() {
		const low = JSON.parse(localStorage.getItem('low') || 'null');

		if (low === null)
			return twitch.say(qs.channel, 'No data.');

		twitch.say(
			qs.channel, `Lowest score in the last 24 hours: ${low[0]} ${low[1]}`);
	}

	onDropRecent() {
		const scores = JSON.parse(localStorage.getItem('recent') || '{}');
		const output = [];

		for (let key of Object.keys(scores))
			output.push(`${key} ${scores[key][0]}`)

		twitch.say(qs.channel, `Recent scores: ${output.join(', ')}`);
	}

	onDropTop() {
		const top = JSON.parse(localStorage.getItem('top') || 'null');

		if (top === null)
			return twitch.say(qs.channel, 'No data.');

		twitch.say(
			qs.channel, `Highest score in the last 24 hours: ${top[0]} ${top[1]}`);
	}

	onLose(avatar) {
		const orig = avatar.sprite;

		avatar.chute.visible = false;
		avatar.active = false;
		avatar.label.destroy();
		avatar.label = null;
		avatar.sprite = this.add.image(
				avatar.sprite.x, avatar.sprite.y, `drop${avatar.spriteNumber}`)
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
