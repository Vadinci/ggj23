import { Point } from "pixi.js";
import { Event } from "core/classes/Event";
import { Input } from "./Input";
import { ITickable } from "./ITickable";
import { core } from "core";

const BASE_SPEED = 0.8;

export enum PlayerState 
{
	IDLE,
	FLYING,
	DIGGING
}
export class Player implements ITickable
{
	public onHitGround: Event<[]> = new Event();
	public onStopped: Event<[]> = new Event();
	
	private _state: PlayerState = PlayerState.IDLE;

	private _input: Input;

	private _speed = BASE_SPEED;
	private _speedMultiplier = 1;

	private _position: Point = new Point();
	private _velocity: Point = new Point();

	constructor(input: Input)
	{
		this._position.x = 48;
		this._velocity.y = 0.5;
		this._input = input;
	}

	public get x(): number 
	{
		return this._position.x | 0;
	}
	
	public get y(): number 
	{
		return this._position.y | 0;
	}

	public get state(): PlayerState
	{
		return this._state;
	}

	public launch(from: Point, velocity: Point): void
	{
		this._position.copyFrom(from);
		this._velocity.copyFrom(velocity);
		this._state = PlayerState.FLYING;
		this._speed = BASE_SPEED;
	}

	public tick(): void 
	{
		switch(this._state)
		{
		case PlayerState.DIGGING:
			this._digTick();
			break;
		case PlayerState.FLYING:
			this._flyTick();
			break;
		case PlayerState.IDLE:
			return;
		}

		this._position.x += this._velocity.x;
		this._position.y += this._velocity.y;
	}

	private _flyTick(): void
	{
		if (this._position.y >= 0) 
		{
			this._position.y = 0;
			this.onHitGround.fire();
			this._state = PlayerState.DIGGING;
			return;
		}

		this._velocity.y += 0.05;

		this._velocity.x *= 0.99;
		this._velocity.y *= 0.99;
	}

	private _digTick(): void
	{
		if (this._speed > 0) 
		{
			this._speed -= 0.001;
		}
		else 
		{
			this._speed = 0;
			this.onStopped.fire();
			this._state = PlayerState.IDLE
			return;
		}
		
		this._speedMultiplier -= (this._speedMultiplier - 1)*0.05;
		
		if (this._input.isTouching)
		{
			const dx = this._input.x / 500;
			this._velocity.x += dx; // Math.sqrt(Math.abs(dx))*Math.sign(dx);
		}

		this._velocity.y += 0.05;

		const magnitude = Math.sqrt(this._velocity.x ** 2 + this._velocity.y ** 2);
		const targetSpeed = this._speed * this._speedMultiplier;
		this._velocity.x *= (targetSpeed/magnitude);
		this._velocity.y *= (targetSpeed/magnitude);
	}
}