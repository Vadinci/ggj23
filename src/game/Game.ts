import { core } from "core";
import log from "loglevel";
import { Container, Rectangle } from "pixi.js";
import { Camera } from "./Camera";
import { Input } from "./Input";
import { ITickable } from "./ITickable";
import { Player } from "./Player";
import { RootVisual } from "./RootVisual";
import { TileChunk } from "./TileChunk";

const logger = log.getLogger("Game");

export class Game 
{
	private _inputContainer: Container;
	private _input: Input;

	private _world: Container;

	private _player: Player;
	private _rootVisual: RootVisual;

	private _camera: Camera;

	private _tickables: ITickable[] = [];

	constructor()
	{
		this._inputContainer = new Container();
		this._input = new Input(this._inputContainer);

		this._world = new Container();

		this._inputContainer.hitArea = new Rectangle(-5000, -5000, 10000, 10000);

		this._player = new Player(this._input);
		this._rootVisual = new RootVisual(this._player);

		this._camera = new Camera(this._world);
	}

	public async start(parent: Container): Promise<void>
	{
		await core.services.content.load([
			["test.yaml", "test"],
			["tiles/T_Tile_01.png", "tile_01"],
		]).complete;

		const config = core.services.content.getYaml("test");
		logger.log(config);

		parent.addChild(this._world);
		parent.addChild(this._inputContainer);
		this._input.enable();

		core.services.app.ticker.add(this._onTick, this);

		this._camera.setTarget(this._player);

		this._world.addChild(new TileChunk(Array.from({ length: 256 }, (v,i)=>0)));

		this._tickables.push(this._player);
		this._tickables.push(this._rootVisual);
		this._tickables.push(this._camera);
		this._world.addChild(this._rootVisual);

		
	}

	public stop(): void
	{
		core.services.app.ticker.remove(this._onTick, this);
		this._inputContainer.parent.removeChild(this._inputContainer);
	}

	private _onTick(): void
	{
		this._tickables.forEach(tickable => tickable.tick());
	}
}