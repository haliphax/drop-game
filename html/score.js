/** Class structure for holding scores */
export default class Score {
	username;
	score;
	when;

	constructor(username, score, when = null) {
		this.username = username;
		this.score = score;

		if (when === null)
			this.when = Date.now();
		else
			this.when = when;
	}
};
