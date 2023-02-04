import { core } from "core";
import { ContentRequest } from "core/services/Content";
import log from "loglevel";
import { Container, Point, Rectangle } from "pixi.js";
import { Camera } from "./Camera";
import { Input } from "./Input";
import { ITickable } from "./ITickable";
import { Player } from "./Player";
import { RootVisual } from "./RootVisual";
import { SeedVisual } from "./SeedVisual";
import { TileChunk } from "./TileChunk";

const logger = log.getLogger("Game");

export enum GameState 
{
	BOOTUP,
	LAUNCHING,
	FLYING,
	DIGGING,
	PANNING
}

export class Game 
{
	private _inputContainer: Container;
	private _input: Input;

	private _world: Container;

	private _player: Player;
	private _rootVisual: RootVisual;
	private _seedVisual: SeedVisual;

	private _camera: Camera;

	private _state: GameState = GameState.BOOTUP;

	private _tickables: ITickable[] = [];

	constructor()
	{
		this._inputContainer = new Container();
		this._input = new Input(this._inputContainer);

		this._world = new Container();

		this._inputContainer.hitArea = new Rectangle(-5000, -5000, 10000, 10000);

		this._player = new Player(this._input);
		this._rootVisual = new RootVisual(this._player);
		this._seedVisual = new SeedVisual(this._player);

		this._camera = new Camera(this._world);
	}

	public async start(parent: Container): Promise<void>
	{
		await core.services.content.load([
			...Array.from({ length: 9 }, (v, i) => 
			{
				return [`tiles/T_Tile_0${i}.png`,`tile_0${i}`]
			}) as ContentRequest[],
			...Array.from({ length: 9 }, (v, i) => 
			{
				return [`tiles/T_Tile_0${i}_Alt.png`,`tile_0${i}_alt`]
			}) as ContentRequest[]
		]).complete;

		parent.addChild(this._world);
		parent.addChild(this._inputContainer);
		this._input.enable();

		core.services.app.ticker.add(this._onTick, this);

		// this._camera.setTarget(this._player);

		for (let ii =0; ii < 10; ii++)
		{
			const chunk = new TileChunk(ii*16);
			chunk.y = ii * 128;
			this._world.addChild(chunk);
		}

		this._tickables.push(this._player);
		this._tickables.push(this._camera);

		this._startFlying();
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

	private _startFlying(): void
	{
		this._player.onHitGround.once(()=>
		{
			this._startDigging();
		}, this);

		this._camera.setTarget(this._player);
		this._player.launch(new Point(0, -40), new Point(10,-10));

		this._tickables.push(this._seedVisual);
		this._world.addChild(this._seedVisual);
	}

	private _startDigging(): void
	{
		this._tickables.splice(this._tickables.indexOf(this._seedVisual),1);

		this._tickables.push(this._rootVisual);
		this._world.addChild(this._rootVisual);
	}
}