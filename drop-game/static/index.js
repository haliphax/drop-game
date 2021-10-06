import constants from './constants.js';
import emitter from './emitter.js';
import Game from './game.js';
import qs from './querystring.js';
import { isModerator, isBroadcaster, twitch } from './twitch.js';

const game = new Phaser.Game({
	height: constants.SCREEN_HEIGHT,
	physics: {
		default: 'arcade',
		arcade: {
			debug: false,
			gravity: {
				y: (qs.gravity || constants.GRAVITY),
			},
		},
	},
	pixelArt: true,
	render: {
		transparent: true,
	},
	scene: [Game],
	type: Phaser.AUTO,
	width: constants.SCREEN_WIDTH,
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
		case 'queuedrop':
			if (!isBroadcaster(tags) && !isModerator(tags))
				return;

			emitter.emit('queuedrop', args ? parseInt(args) : null);
			break;
		case 'startdrop':
			if (!isBroadcaster(tags) && !isModerator(tags))
				return;

			emitter.emit('startdrop');
			break;
	}
});

twitch.connect();
