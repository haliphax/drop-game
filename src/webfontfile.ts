import WebFont from "webfontloader";

export default class WebFontFile extends Phaser.Loader.File {
	fontNames: string[];

	constructor(
		loader: Phaser.Loader.LoaderPlugin,
		fontNames: string | string[],
	) {
		super(loader, {
			type: "webfont",
			key: fontNames.toString(),
		});

		this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
	}

	load() {
		const config: WebFont.Config = {
			active: () => this.loader.nextFile(this, true),
			google: {
				families: this.fontNames,
			},
		};

		WebFont.load(config);
	}
}
