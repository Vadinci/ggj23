import { core } from "core";
import { Container, IPointData, Point } from "pixi.js";
import { ITickable } from "./ITickable";

export class Camera implements ITickable 
{
	private _world: Container;
	private _target: IPointData = new Point(0,0);

	private _position: Point = new Point();

	public constructor(world: Container)
	{
		this._world = world;
	}

	public get x(): number
	{
		return this._position.x;
	}

	public get y(): number
	{
		return this._position.y;
	}


	public setTarget(target: IPointData): void
	{
		this._target = target;
	}

	public tick(): void 
	{
		this._position.copyFrom(this._target);
		
		// focus on target
		this._world.x = -this._position.x;
		this._world.y = -this._position.y;

		// offset to center
		this._world.x += core.services.app.app.screen.width/2
		this._world.y += core.services.app.app.screen.height/2

		this._world.x = this._world.x | 0;
		this._world.y = this._world.y | 0;
	}
}