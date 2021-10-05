import constants from './constants.js';
import emitter from './emitter.js';
import Game from './game.js';

const qs = Object.fromEntries(
	window.location.href.split('?')[1].split('&').map(v => v.split('=')));
const twitch = new tmi.Client({
	channels: [qs.channel],
	identity: {
		username: qs.username,
		password: `oauth:${qs.oauth}`,
	},
});
const game = new Phaser.Game({
	height: 1080,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: {
				y: constants.GRAVITY,
			},
		},
	},
	pixelArt: true,
	render: {
		transparent: true,
	},
	scene: [Game],
	type: Phaser.AUTO,
	width: 1920,
});

const dropCommandRgx = /^\!drop(?:\s*([^ ]+)?)$/i;
twitch.on('message', (channel, tags, message, self) => {
	if (self || !dropCommandRgx.exec(message)) return;

	emitter.emit('drop', tags['display-name']);
});

twitch.connect();
