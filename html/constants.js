const constants = {
	/** minimum vertical velocity "bump" on collision */
	BUMP_MIN: 20,
	/** random spread for bump */
	BUMP_SPREAD: 20,
	/** Twitch Client ID for hxDrop */
	CLIENT_ID: "avj8ew0h1zd2t3wqu8h10855wirov8",
	/** font family for labels */
	FONT_FAMILY: "Syne Mono",
	/** default force of gravity */
	GRAVITY: 400,
	/** default force of gravity with chute */
	GRAVITY_CHUTE: 30,
	/** username label font size */
	LABEL_SIZE: 20,
	/** maximum angle of sway */
	MAX_SWAY: 25,
	/** maximum random velocity */
	MAX_VELOCITY: 600,
	/** number of sprites */
	NUM_SPRITES: 5,
	/** URL for obtaining OAuth token */
	OAUTH_URL: null,
	/** number of recent scores to list with !droprecent */
	RECENT_SCORES: 10,
	/** score label font size */
	SCORE_SIZE: 26,
	/** height of screen */
	SCREEN_HEIGHT: 1080,
	/** width of screen */
	SCREEN_WIDTH: 1920,
	/** font stroke color */
	STROKE_COLOR: "#000",
	/** font stroke thickness */
	STROKE_THICKNESS: 6,
	/** number of seconds between score tidying */
	TIDY_SCHEDULE: 5 * 60 * 1000,
	/** number of recent drops to track */
	TRACK_RECENT: 10,
	/** 24 hours in milliseconds */
	TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000,
	/** default wait before reset (in seconds) */
	WAIT_FOR_RESET: 60,
};

constants.OAUTH_URL =
	`https://id.twitch.tv/oauth2/authorize` +
	`?client_id=${constants.CLIENT_ID}` +
	`&redirect_uri=${encodeURIComponent(
		window.location.href.replace(/[^/]\.html|$/i, "oauth.html"),
	)}` +
	`&response_type=token` +
	`&scope=chat:read%20chat:edit`;

export default constants;
