import { hs } from "./util.js";

const twitch = new tmi.Client({
	options: { debug: true },
	channels: [hs.channel],
	identity: {
		username: hs.username,
		password: `oauth:${hs.oauth}`,
	},
});

const isBroadcaster = (tags) => tags.badges.hasOwnProperty("broadcaster");
const isModerator = (tags) => tags.mod;

export { isBroadcaster, isModerator, twitch };
