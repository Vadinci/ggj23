import { AppService } from "./core/services/App";
import { ContentService } from "./core/services/Content";
import { Core } from "./core/Core";
import log from "loglevel";
import { settings } from "@pixi/settings";
import { SCALE_MODES } from "pixi.js";

/**
 * global logger access
 */
window["log"] = log;
log.setDefaultLevel("DEBUG");

const app = new AppService({
	width: 240,
	height: 360,
	antialias: false,
	//resizeTo: window,
	resolution: 2,
	backgroundColor: 0x88aaff
});

settings.SCALE_MODE = SCALE_MODES.NEAREST;

export const core = new Core({
	app,
	content: new ContentService("./content/")
});