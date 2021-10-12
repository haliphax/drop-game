import constants from './constants.js';
import emitter from './emitter.js';
import Game from './game.js';
import qs from './querystring.js';
import { isBroadcaster, isModerator, twitch } from './twitch.js';

if (qs.demo) document.body.classList.add('demo');

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
		case 'clearscores':
			if (!isBroadcaster(tags) && !isModerator(tags))
				return;

			localStorage.clear();
			twitch.say(qs.channel, 'Scores cleared.');
			break;
		case 'drop':
			emitter.emit('drop', tags['display-name']);
			break;
		case 'droplow':
			emitter.emit('droplow');
			break;
		case 'droptop':
			emitter.emit('droptop');
			break;
		case 'droprecent':
			emitter.emit('droprecent');
			break;
		case 'queuedrop':
			if (!isBroadcaster(tags) && !isModerator(tags))
				return;

			emitter.emit('queuedrop', args ? parseInt(args) : null);
			break;
		case 'resetdrop':
			if (!isBroadcaster(tags) && !isModerator(tags))
				return;

			emitter.emit('resetdrop');
			break;
		case 'startdrop':
			if (!isBroadcaster(tags) && !isModerator(tags))
				return;

			twitch.say(qs.channel, 'Let\'s goooooooooooo! PogChamp')
			emitter.emit('startdrop');
			break;
	}
});

twitch.connect();
