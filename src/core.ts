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

const TARGET_WIDTH = 96;
const TARGET_HEIGHT = 186;

const TARGET_RATIO = TARGET_WIDTH/TARGET_HEIGHT;
const WINDOW_RATIO = window.innerWidth/window.innerHeight; 

let height = TARGET_HEIGHT;
let width = TARGET_WIDTH;

if (TARGET_RATIO > WINDOW_RATIO)
{
	// window is taller than expected
	height = width/WINDOW_RATIO;
}
else 
{
	width = height*WINDOW_RATIO;
}


const app = new AppService({
	width: width,
	height: height,
	antialias: false,
	//resizeTo: window,
	resolution: window.innerHeight/height,
	backgroundColor: 0xd6e5ff
});

settings.SCALE_MODE = SCALE_MODES.NEAREST;
settings.ROUND_PIXELS = false;

export const core = new Core({
	app,
	content: new ContentService("./content/")
});
