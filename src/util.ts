/** parsed hash string (key-value pairs become object properties) */
const hs = Object.fromEntries(
	window.location.hash
		.substring(1)
		?.split("&")
		.map((v) => v.split("=")) ?? [],
);

/** awaitable sleep function */
const sleep = async (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export { hs, sleep };
