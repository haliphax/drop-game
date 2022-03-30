/** parsed hash string (key-value pairs become object properties) */
const hs = Object.fromEntries(
	window.location.hash.substring(1)?.split('&').map(v => v.split('=')) ?? []);

export { hs };
