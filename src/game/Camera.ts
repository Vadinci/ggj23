import { core } from "core";
import { Random } from "core/classes/Random";
import { Container, IPointData, Point } from "pixi.js";
import { ITickable } from "./ITickable";

export class Camera implements ITickable 
{
	private _world: Container;
	private _target: IPointData = new Point(0,0);
	private _offset: Point = new Point(0,0);

	private _position: Point = new Point();
	private _shake = 0;

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

	public setOffset(x: number, y: number): void
	{
		this._offset.set(x,y);
	}

	public shake(amount: number)
	{
		this._shake += amount;
	}


	public setTarget(target: IPointData): void
	{
		this._target = target;
	}

	public tick(): void 
	{
		this._position.x += ((this._target.x + this._offset.x) - this._position.x)*0.33;
		this._position.y += ((this._target.y + this._offset.y) - this._position.y)*0.33;
		
		// focus on target
		this._world.x = -this._position.x;
		this._world.y = -this._position.y;

		// offset to center
		this._world.x += core.services.app.app.screen.width/2
		this._world.y += core.services.app.app.screen.height/2

		if (this._shake > 0)
		{
			this._world.x += Random.pick([-1,1])*Random.float(this._shake/2, this._shake);
			this._world.y += Random.pick([-1,1])*Random.float(this._shake/2, this._shake);

			this._shake *= 0.85;
			if (this._shake < 0.1)
			{
				this._shake = 0;
			}
		}

		this._world.x = this._world.x | 0;
		this._world.y = this._world.y | 0;
	}
}