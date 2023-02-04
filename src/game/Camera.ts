import { core } from "core";
import { Container, IPointData, Point } from "pixi.js";
import { ITickable } from "./ITickable";

export class Camera implements ITickable 
{
	private _world: Container;
	private _target: IPointData = new Point(0,0);

	public constructor(world: Container)
	{
		this._world = world;
	}

	public setTarget(target: IPointData): void
	{
		this._target = target;
	}

	public tick(): void 
	{
		// focus on player
		this._world.x = -this._target.x;
		this._world.y = -this._target.y;

		// offset to center
		this._world.x += core.services.app.app.screen.width/2
		this._world.y += core.services.app.app.screen.height/2
	}
}