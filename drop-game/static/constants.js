export default {
	/** minimum vertical velocity "bump" on collision */
	BUMP_MIN: 20,
	/** random spread for bump */
	BUMP_SPREAD: 20,
	/** default force of gravity */
	GRAVITY: 400,
	/** default force of gravity with chute */
	GRAVITY_CHUTE: 30,
	/** maximum angle of sway */
	MAX_SWAY: 25,
	/** maximum random velocity */
	MAX_VELOCITY: 600,
	/** number of sprites */
	NUM_SPRITES: 5,
	/** number of recent scores to list with !droprecent */
	RECENT_SCORES: 10,
	/** height of screen */
	SCREEN_HEIGHT: 1080,
	/** width of screen */
	SCREEN_WIDTH: 1920,
	/** number of seconds between score tidying */
	TIDY_SCHEDULE: 5 * 60 * 1000,
	/** number of recent drops to track */
	TRACK_RECENT: 10,
	/** 24 hours in milliseconds */
	TWENTY_FOUR_HOURS: 24 * 60 * 60 * 1000,
	/** default wait before reset (in seconds) */
	WAIT_FOR_RESET: 60,
}
