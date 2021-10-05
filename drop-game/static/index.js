import constants from './constants.js';
import emitter from './emitter.js';
import Game from './game.js';
import qs from './querystring.js';

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

const commandRgx = /^(\![-_.a-z0-9]+)(?:\s+(.+))?$/i;
twitch.on('message', (channel, tags, message, self) => {
	const cmd = commandRgx.exec(message);

	if (self || !cmd) return;

	const command = cmd[1].toLowerCase().substring(1);
	const args = cmd[2];

	switch (command) {
		case 'drop':
			emitter.emit('drop', tags['display-name']);
			break;
	}
});

twitch.connect();
