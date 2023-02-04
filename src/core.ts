import { AppService } from "./core/services/App";
import { ContentService } from "./core/services/Content";
import { Core } from "./core/Core";

const app = new AppService({
	width: 480,
	height: 720,
	antialias: true,
	//resizeTo: window,
	resolution: 1,
	backgroundColor: 0x222034
});

export const core = new Core({
	app,
	content: new ContentService("./content/")
});