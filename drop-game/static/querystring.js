const doParse = text => Object.fromEntries(
	text.split('&').map(v => v.split('=')))

const qs = doParse(window.location.href.split('?')[1] ?? '');
const hs = doParse(window.location.hash.substring(1));

export { qs, hs }
