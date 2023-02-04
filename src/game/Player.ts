import { Point } from "pixi.js";
import { Input } from "./Input";
import { ITickable } from "./ITickable";

export class Player implements ITickable
{
	private _input: Input;

	private _speed = 1.6;

	private _position: Point = new Point();
	private _velocity: Point = new Point();

	constructor(input: Input)
	{
		this._position.x = 100;
		this._velocity.y = 0.5;
		this._input = input;
	}

	public get x(): number 
	{
		return this._position.x;
	}
	
	public get y(): number 
	{
		return this._position.y;
	}

	public tick(): void 
	{
		
		if (this._input.isTouching)
		{
			const dx = this._input.x / 500;
			this._velocity.x += dx; // Math.sqrt(Math.abs(dx))*Math.sign(dx);
		}

		this._velocity.y += 0.1;

		const magnitude = Math.sqrt(this._velocity.x ** 2 + this._velocity.y ** 2);
		this._velocity.x *= (this._speed/magnitude);
		this._velocity.y *= (this._speed/magnitude);

		
		this._position.x += this._velocity.x;
		this._position.y += this._velocity.y;
	}
}