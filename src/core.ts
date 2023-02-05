import { AppService } from "./core/services/App";
import { ContentService } from "./core/services/Content";
import { Core } from "./core/Core";
import log from "loglevel";
import { settings } from "@pixi/settings";
import { SCALE_MODES } from "pixi.js";

/**
 * global logger access
 */
// eslint-disable-next-line
// @ts-ignore
window["log"] = log;
log.setDefaultLevel("DEBUG");

const app = new AppService({
	width: 96,
	height: 168,
	antialias: false,
	//resizeTo: window,
	resolution: 4,
	backgroundColor: 0xe3eeff
});

settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.ROUND_PIXELS = false;

export const core = new Core({
	app,
	content: new ContentService("./content/")
});
