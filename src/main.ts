import { Game } from "game/Game";
import "./core"
import { core } from "./core"

core.initialize().then(async () => 
{
	const game = new Game();
	game.start(core.services.app.app.stage);
});