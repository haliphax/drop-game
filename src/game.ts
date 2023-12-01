import Phaser, { Tilemaps } from "phaser";
import Avatar from "./avatar";
import constants from "./constants";
import emitter from "./emitter";
import Score from "./score";
import { twitch } from "./twitch";
import { hs, sleep } from "./util";
import WebFontFile from "./webfontfile";

/** main game scene */
export default class Game extends Phaser.Scene {
	active: boolean;
	dropGroup: Phaser.Physics.Arcade.Group | null;
	droplets!: Phaser.GameObjects.Particles.ParticleEmitter;
	droppers: Map<string, Avatar>;
	droppersArray: Array<Avatar>;
	droppersQueue: Set<string>;
	endTimer?: NodeJS.Timeout;
	endWait: integer;
	pad: Phaser.Physics.Arcade.Image | null = null;
	rect: Phaser.GameObjects.Rectangle | null = null;
	queue: boolean;
	winner: Avatar | null;

	constructor() {
		super();
		this.active = false;
		this.dropGroup = null;
		this.droppers = new Map<string, Avatar>();
		this.droppersArray = [];
		this.droppersQueue = new Set<string>();
		this.endWait = parseInt(hs.wait || constants.WAIT_FOR_RESET) * 1000;
		this.queue = false;
		this.winner = null;

		emitter.on("drop", this.onDrop, this);
		emitter.on("droplow", this.onDropLow, this);
		emitter.on("droprecent", this.onDropRecent, this);
		emitter.on("droptop", this.onDropTop, this);
		emitter.on("clearscores", this.onClearScores, this);
		emitter.on("lose", this.onLose, this);
		emitter.on("queuedrop", this.onQueueDrop, this);
		emitter.on("resetdrop", this.onResetDrop, this);
		emitter.on("startdrop", this.onStartDrop, this);

		setInterval(this.tidyScores.bind(this), constants.TIDY_SCHEDULE);
		this.tidyScores();
	}

	/** @type {Score[]} */
	get scores() {
		return JSON.parse(localStorage.getItem("scores") || "[]");
	}

	preload() {
		this.load.addFile(new WebFontFile(this.load, constants.FONT_FAMILY));
		this.load.setBaseURL("./default");
		this.load.audio("drop", "drop.mp3");
		this.load.audio("land", "land.mp3");
		this.load.audio("win", "win.mp3");
		this.load.image("chute", "chute.png");
		this.load.image("drop1", "drop1.png");
		this.load.image("drop2", "drop2.png");
		this.load.image("drop3", "drop3.png");
		this.load.image("drop4", "drop4.png");
		this.load.image("drop5", "drop5.png");
		this.load.image("pad", "pad.png");
		this.load.spritesheet("droplet", "droplet.png", {
			frameHeight: 82,
			frameWidth: 82,
		});
	}

	create() {
		this.physics.world
			.setBounds(0, 0, constants.SCREEN_WIDTH, constants.SCREEN_HEIGHT)
			.setBoundsCollision(true, true, false, true);
		this.pad = this.physics.add.image(0, 0, "pad");
		this.pad
			.setMaxVelocity(0, 0)
			.setOrigin(0.5, 1)
			.setVisible(false)
			.setPosition(0, constants.SCREEN_HEIGHT);
		this.droplets = this.add
			.particles(0, 0, "droplet", {
				blendMode: Phaser.BlendModes.ADD,
				emitting: false,
				gravityY: -500,
				lifespan: 500,
				scale: { start: 1, end: 0.2 },
				speed: { random: [50, 150] },
			})
			.setDepth(1);
		this.ready();
	}

	ready(): void {
		if (!this.pad?.body) {
			setTimeout(this.ready.bind(this), 100);
			return;
		}

		this.dropGroup = this.physics.add.group();
		this.physics.add.collider(
			this.dropGroup,
			this.dropGroup,
			this.crash.bind(this),
		);

		this.physics.world.on(
			Phaser.Physics.Arcade.Events.WORLD_BOUNDS,
			(obj: Phaser.Physics.Arcade.Body, _up: boolean, down: boolean) => {
				// "bounce" off the walls
				if (!down) {
					obj.velocity.y =
						-1 * (Math.random() * constants.BUMP_MIN + constants.BUMP_SPREAD);
					return;
				}

				const avatar = obj.gameObject.getData("avatar") as Avatar;
				emitter.emit("lose", avatar);
			},
		);

		this.pad.body.immovable = true;
		this.pad.body.setSize(this.pad.width, this.pad.height - 10, true);
		this.physics.add.collider(
			this.pad,
			this.dropGroup,
			this.landOnPad.bind(this),
		);

		if (hs.debug)
			this.rect = this.add
				.rectangle(
					0,
					this.pad.body.y,
					this.pad.body.width,
					this.pad.body.height,
				)
				.setOrigin(0.5, 1)
				.setDepth(1)
				.setStrokeStyle(2, 0xff0ff)
				.setVisible(false);
	}

	update() {
		if (!this.active) return;

		for (const drop of this.droppersArray) {
			if (!drop.active) continue;
			drop.update();
		}

		this.rect?.setPosition(this.pad!.x, this.pad!.y);
	}

	tidyScores() {
		console.debug("Tidying scores");
		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		const scores = this.scores;
		const update = scores.filter((v: Score) => v.when > expiry);
		localStorage.setItem("scores", JSON.stringify(update));
		console.debug("Tidy scores complete");
	}

	start() {
		if (!this.pad) return;

		this.active = true;
		this.droppers.clear();
		this.droppersArray = [];
		this.winner = null;
		this.pad.x = Math.floor(
			this.pad.width / 2 +
				Math.random() * (constants.SCREEN_WIDTH - this.pad.width),
		);

		this.pad.setVisible(true);

		if (hs.debug) this.rect?.setVisible(true);

		console.debug(`Pad X Position: ${this.pad.x}`);
	}

	end() {
		this.active = false;
		this.queue = false;
		this.droppersQueue.clear();
		this.pad?.setVisible(false);
		this.rect?.setVisible(false);

		for (const drop of this.droppersArray) {
			drop.rect?.destroy();
			drop.container.destroy();
		}
	}

	resetTimer() {
		clearTimeout(this.endTimer);
		this.endTimer = setTimeout(this.end.bind(this), this.endWait);
	}

	async resolveQueue() {
		this.start();
		twitch.say(hs.channel, "Let's goooooooooooo! PogChamp");
		const enumKeys = this.droppersQueue.keys();
		let next: IteratorResult<string, Avatar>;

		while ((next = enumKeys.next())) {
			if (next.done) break;
			emitter.emit("drop", next.value, true);
			await sleep(
				Math.ceil(Math.random() * constants.MIN_QUEUE_BUFFER) +
					constants.MAX_QUEUE_BUFFER -
					constants.MIN_QUEUE_BUFFER,
			);
		}
	}

	crash(
		a: Phaser.Types.Physics.Arcade.GameObjectWithBody | Tilemaps.Tile,
		b: Phaser.Types.Physics.Arcade.GameObjectWithBody | Tilemaps.Tile,
	) {
		if (a instanceof Tilemaps.Tile || b instanceof Tilemaps.Tile) return;

		for (const container of [a, b])
			container.body!.velocity.y =
				-1 * (Math.random() * constants.BUMP_MIN + constants.BUMP_SPREAD);
	}

	landOnPad(
		padObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Tilemaps.Tile,
		dropObj: Phaser.Types.Physics.Arcade.GameObjectWithBody | Tilemaps.Tile,
	) {
		const pad = padObj as Phaser.Types.Physics.Arcade.GameObjectWithBody;
		const drop = dropObj as Phaser.Types.Physics.Arcade.GameObjectWithBody;

		if (!pad.body!.touching.up) return;

		const avatar = drop.getData("avatar") as Avatar;
		const pos = Math.abs(avatar.container.x - this.pad!.x);
		const halfWidth =
			this.pad!.body!.halfWidth + Math.round(avatar.container!.width / 2);
		const score = ((halfWidth - pos) / halfWidth) * 100;

		// horizontal overlap mid-frame but not a landing; bounce off
		if (score < 0) {
			drop.body.velocity.x *= -1;
			return;
		}

		this.droplets.emitParticleAt(
			avatar.container.x,
			avatar.container.y + avatar.sprite.height / 2,
			20,
		);
		this.resetTimer();
		avatar.swayTween?.stop();
		avatar.swayTween = null;
		avatar.score = score;
		avatar.container.setY(
			this.game.scale.gameSize.height -
				this.pad!.body!.height -
				avatar.sprite.height / 2,
		);
		drop.body.enable = false;
		this.dropGroup!.remove(drop);
		avatar.active = false;
		avatar.chute.visible = false;
		avatar.sprite.angle = 0;

		const scores = this.scores;

		scores.push(new Score(avatar.username, avatar.score));
		localStorage.setItem("scores", JSON.stringify(scores));

		if (this.winner && avatar.score < this.winner.score) {
			this.sound.stopByKey("land");
			this.sound.play("land");
			return emitter.emit("lose", avatar);
		}

		if (this.winner) {
			emitter.emit("lose", this.winner);
			this.winner.container.setDepth(0);
		}

		this.sound.stopByKey("win");
		this.sound.play("win");
		avatar.container.setDepth(1);
		this.winner = avatar;
		avatar.scoreLabel!.text = avatar.score.toFixed(2);
		avatar.scoreLabel!.setVisible(true);
	}

	// events

	onDrop(username: string, queue = false, emote?: string) {
		if (!this.active && !this.queue) this.start();
		else if (this.active && this.queue && !queue) return;

		if (this.queue && !queue && this.droppersQueue.has(username)) {
			return;
		} else if (!this.queue && this.droppers.has(username)) return;

		if (this.queue && !queue) {
			this.droppersQueue.add(username);
			return;
		}

		clearTimeout(this.endTimer);

		const finish = () => {
			const avatar = new Avatar(username, this, emote);
			this.droppers.set(username, avatar);
			this.droppersArray.push(avatar);
			this.dropGroup!.add(avatar.container);
			this.sound.stopByKey("drop");
			this.sound.play("drop");
		};

		if (emote) {
			const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${emote}/default/dark/3.0`;

			this.load.setBaseURL();
			this.load
				.image(emote, emoteUrl)
				.on(`filecomplete-image-${emote}`, () => finish())
				.start();

			return;
		}

		finish();
	}

	onDropLow() {
		const scores = this.scores;

		if (scores.length === 0) return twitch.say(hs.channel, "VoteNay No data.");

		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		let lowest = new Score(null, 101);

		for (const score of scores) {
			if (score.when < expiry) continue;

			if (score.score < lowest.score) lowest = score;
		}

		twitch.say(
			hs.channel,
			`ResidentSleeper Lowest score in the past 24 hours: ${
				lowest.username
			} ${lowest.score.toFixed(2)}`,
		);
	}

	onDropRecent() {
		const scores = this.scores;
		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		const recent = new Map<string, Score>();
		let tracking = 0;
		let oldest = new Score(null, 0, 0);

		for (const score of scores) {
			if (score.when < expiry) continue;

			if (recent.has(score.username)) {
				if (recent.get(score.username)?.when ?? 0 < score.when)
					recent.set(score.username, score);
			} else if (
				tracking < constants.RECENT_SCORES ||
				score.when > oldest.when
			) {
				if (tracking >= constants.RECENT_SCORES && oldest.username) {
					recent.delete(oldest.username);
				} else {
					tracking++;
				}

				if (score.when > oldest.when) oldest = score;

				recent.set(score.username, score);
			}
		}

		const out = Object.values(recent)
			.sort((a, b) => a.when - b.when)
			.map((v) => `${v.username} (${v.score.toFixed(2)})`)
			.join(", ");

		twitch.say(hs.channel, `OhMyDog Recent drops: ${out}`);
	}

	onDropTop() {
		const scores = this.scores;

		if (scores.length === 0) return twitch.say(hs.channel, "VoteNay No data.");

		const expiry = Date.now() - constants.TWENTY_FOUR_HOURS;
		let highest = new Score(null, 0);

		for (const score of scores) {
			if (score.when < expiry) continue;

			if (score.score > highest.score) highest = score;
		}

		twitch.say(
			hs.channel,
			`Poooound Highest score in the past 24 hours: ${
				highest.username
			} ${highest.score.toFixed(2)}`,
		);
	}

	onClearScores(who: string[]) {
		if (!who) {
			localStorage.clear();
			twitch.say(hs.channel, "Scores cleared.");
		} else {
			const update = this.scores.filter(
				(v: Score) => v.username && !who.includes(v.username.toLowerCase()),
			);
			localStorage.setItem("scores", JSON.stringify(update));
			twitch.say(hs.channel, `Scores cleared for ${who.join(", ")}.`);
		}
	}

	onLose(avatar: Avatar) {
		this.resetTimer();
		(avatar.container.body as Phaser.Physics.Arcade.Body).enable = false;
		avatar.active = false;
		avatar.chute.visible = false;
		avatar.container.setActive(false);
		avatar.label?.destroy();
		avatar.label = null;
		avatar.rect?.setVisible(false);
		avatar.scoreLabel?.destroy();
		avatar.scoreLabel = null;
		avatar.sprite.angle = 0;
		avatar.sprite.setAlpha(0.25);
		avatar.swayTween?.stop();
		avatar.swayTween = null;
		this.dropGroup?.remove(avatar.container);
	}

	async onQueueDrop(delay = null) {
		if (this.queue) {
			twitch.say(hs.channel, "NotLikeThis A queue is already forming!");
			return;
		}

		this.queue = true;

		if (delay !== null) setTimeout(this.resolveQueue.bind(this), delay * 1000);

		twitch.say(hs.channel, "SeemsGood Queue started!");
	}

	onResetDrop() {
		this.end();
	}

	async onStartDrop() {
		if (!this.queue) return;

		await this.resolveQueue();
	}
}
