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

const form = document.querySelector("form")!;

form.action += `#oauth=${hs.access_token}&channel=${user.login}`;
form.addEventListener("submit", () => {
	// options
	["gravity", "gravity_chute", "max_velocity", "wait"].forEach((option) => {
		const value = (document.getElementById(option)! as HTMLInputElement).value;

		if (value) {
			form.action += `&${option}=${encodeURIComponent(value)}`;
		}
	});
});
