import tmi, { ChatUserstate } from "tmi.js";
import { hs } from "./util";

const twitch = new tmi.Client({
	options: { debug: true },
	channels: [hs.channel],
	identity: {
		username: hs.username,
		password: `oauth:${hs.oauth}`,
	},
});

const isBroadcaster = (tags: ChatUserstate) => tags.badges?.broadcaster;
const isModerator = (tags: ChatUserstate) => tags.mod;

export { isBroadcaster, isModerator, twitch };
