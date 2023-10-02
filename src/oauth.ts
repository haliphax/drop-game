import constants from "./constants";
import { hs } from "./util";

const user = await fetch("https://api.twitch.tv/helix/users", {
	headers: new Headers({
		Authorization: `Bearer ${hs.access_token}`,
		"Client-ID": constants.CLIENT_ID,
	}),
})
	.then((r) => r.json())
	.then((j) => j.data[0]);

window.location.href = window.location.href.replace(
	/\/oauth(?:\/index\.html)?.*$/i,
	`#oauth=${hs.access_token}&channel=${user.login}`,
);
