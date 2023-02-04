import { core } from "core";
import { Container, IPointData } from "pixi.js";
import { ITickable } from "./ITickable";

export class Camera implements ITickable 
{
	private _world: Container;
	private _player: IPointData;

	public constructor(world: Container, player: IPointData)
	{
		this._world = world;
		this._player = player;
	}

	public tick(): void 
	{
		this._world.x = -this._player.x + core.services.app.app.screen.width/2;
		this._world.y = -this._player.y + core.services.app.app.screen.height/2;
	}
}