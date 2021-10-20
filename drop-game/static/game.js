import Avatar from './avatar.js';
import constants from './constants.js';
import emitter from './emitter.js';
import qs from './querystring.js';
import Score from './score.js';
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

		setTimeout(this.tidyScores.bind(this), constants.TIDY_SCHEDULE);
		this.tidyScores();
	}

	get scores() {
		return JSON.parse(localStorage.getItem('scores') || '[]');
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
		for (let drop of this.droppersArray) {
			if (!drop.active)
				continue;

			drop.update();
		}
	}

	tidyScores() {
		console.log('Tidying scores');
		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		const scores = this.scores;
		const update = scores.filter(v => v.when > expiry);
		localStorage.setItem('scores', JSON.stringify(update));
		console.log('Tidy scores complete');
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
		twitch.say(qs.channel, 'Let\'s goooooooooooo! PogChamp')

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
		avatar.score = (total - pos) / total * 100;
		avatar.sprite =
			this.add.image(orig.x, orig.y, `drop${avatar.spriteNumber}`)
				.setOrigin(0.5, 0.5);
		orig.destroy();

		const scores = this.scores;

		scores.push(new Score(avatar.username, avatar.score));
		localStorage.setItem('scores', JSON.stringify(scores));

		if (this.winner && avatar.score <= this.winner.score)
			return emitter.emit('lose', avatar);

		if (this.winner)
			emitter.emit('lose', this.winner);

		this.winner = avatar;
		avatar.scoreLabel = this.add.text(0, 0, avatar.score.toFixed(2),
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
		const scores = this.scores;

		if (scores.length === 0)
			return twitch.say(qs.channel, 'VoteNay No data.');

		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		let lowest = new Score(null, 101);

		for (let score of scores) {
			if (score.when < expiry)
				continue;

			if (score.score < lowest.score)
				lowest = score;
		}

		twitch.say(
			qs.channel,
			`ResidentSleeper Lowest score in the past 24 hours: ${lowest.username} ${lowest.score.toFixed(2)}`);
	}

	onDropRecent() {
		const scores = this.scores;
		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		const recent = {};
		let tracking = 0;
		let oldest = new Score(null, 0, 0);

		for (let score of scores) {
			if (score.when < expiry)
				continue;

			if (recent.hasOwnProperty(score.username)) {
				if (recent[score.username].when < score.when)
					recent[score.username] = score;
			}
			else if (tracking < constants.RECENT_SCORES
				|| score.when > oldest.when)
			{
				if (tracking >= constants.RECENT_SCORES)
					delete recent[oldest.username];
				else
					tracking++;

				if (score.when > oldest.when)
					oldest = score;

				recent[score.username] = score;
			}
		}

		const out = Object.values(recent)
			.sort((a, b) => a.when - b.when)
			.map(v => `${v.username} (${v.score.toFixed(2)})`)
			.join(', ');

		twitch.say(qs.channel, `OhMyDog Recent drops: ${out}`);
	}

	onDropTop() {
		const scores = this.scores;

		if (scores.length === 0)
			return twitch.say(qs.channel, 'VoteNay No data.');

		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		let highest = new Score(null, 0);

		for (let score of scores) {
			if (score.when < expiry)
				continue;

			if (score.score > highest.score)
				highest = score;
		}

		twitch.say(
			qs.channel,
			`Poooound Highest score in the past 24 hours: ${highest.username} ${highest.score.toFixed(2)}`);
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
			twitch.say(qs.channel, 'NotLikeThis A queue is already forming!');
			return;
		}

		this.queue = true;

		if (delay !== null)
			setTimeout(this.resolveQueue.bind(this), delay * 1000);

		twitch.say(qs.channel, 'SeemsGood Queue started!');
	}

	onResetDrop() {
		this.end();
	}

	onStartDrop() {
		if (!this.queue)
			return;

		this.resolveQueue();
	}
}
