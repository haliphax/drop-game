/** Class structure for holding scores */
export default class Score {
	username: string | null;
	score: integer;
	when: number;

	constructor(
		username: string | null,
		score: integer,
		when: number | null = null,
	) {
		this.username = username;
		this.score = score;

		if (when === null) this.when = Date.now();
		else this.when = when;
	}
}
