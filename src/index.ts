import { Game as PhaserGame } from "phaser";
import { ChatUserstate } from "tmi.js";
import constants from "./constants";
import emitter from "./emitter";
import Game from "./game";
import { isBroadcaster, isModerator, twitch } from "./twitch";
import { hs } from "./util";

if (!Object.hasOwnProperty.call(hs, "oauth"))
	window.location.href = constants.OAUTH_URL;

if (hs.demo) document.body.classList.add("demo");

new PhaserGame({
	height: constants.SCREEN_HEIGHT,
	physics: {
		default: "arcade",
		arcade: {
			debug: false,
			gravity: {
				y: hs.gravity || constants.GRAVITY,
			},
		},
	},
	pixelArt: true,
	render: {
		transparent: true,
	},
	scale: {
		autoCenter: Phaser.Scale.CENTER_BOTH,
		mode: Phaser.Scale.FIT,
	},
	scene: [Game],
	type: Phaser.AUTO,
	width: constants.SCREEN_WIDTH,
});

const commandRgx = /^(![-_.a-z0-9]+)(?:\s+(.+))?$/i;

twitch.on(
	"message",
	(_: string, tags: ChatUserstate, message: string, self: boolean) => {
		const cmd = commandRgx.exec(message);

		if (self || !cmd) return;

		const command = cmd[1].toLowerCase().substring(1);
		const args = cmd[2];

		// TODO: command timeouts

		switch (command) {
			case "clearscores": {
				if (!isBroadcaster(tags) && !isModerator(tags)) return;

				const who = args ? args.split(" ").map((v) => v.toLowerCase()) : null;

				emitter.emit("clearscores", who);
				break;
			}
			case "commands":
			case "help":
				twitch.say(
					hs.channel,
					`@${tags.username} -> Drop game commands: https://github.com/haliphax/drop-game/blob/main/README.md#commands`,
				);
				break;
			case "drop": {
				let emote: string | undefined = undefined;

				if (tags.emotes) {
					emote = Object.keys(tags.emotes)[0];
				}

				emitter.emit("drop", tags["display-name"], false, emote);
				break;
			}
			case "droplow":
				emitter.emit("droplow");
				break;
			case "droptop":
				emitter.emit("droptop");
				break;
			case "droprecent":
				emitter.emit("droprecent");
				break;
			case "queuedrop":
				if (!isBroadcaster(tags) && !isModerator(tags)) return;

				emitter.emit("queuedrop", args ? parseInt(args) : null);
				break;
			case "resetdrop":
				if (!isBroadcaster(tags) && !isModerator(tags)) return;

				emitter.emit("resetdrop");
				break;
			case "startdrop":
				if (!isBroadcaster(tags) && !isModerator(tags)) return;

				emitter.emit("startdrop");
				break;
		}
	},
);

twitch.connect();
