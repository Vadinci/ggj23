import { ITickable } from "./ITickable";

export interface ICollider 
{
	readonly x: number;
	readonly y: number;
	readonly width: number;
	readonly height: number;
	readonly tag: string;

	handleCollision(other: ICollider): void;
}

export class Collisions implements ITickable 
{

	/* list of axis aligned bounding boxes */
	private _colliders: ICollider[] = [];

	constructor ()
	{
		//
	}

	public addCollider(collider: ICollider): void
	{
		if (!this._colliders.includes(collider)) 
		{
			this._colliders.push(collider);
		}
	}

	public removeCollider(collider: ICollider): void
	{
		const index = this._colliders.indexOf(collider);
		if (index !== -1) 
		{
			this._colliders.splice(index, 1);
		}
	}

	public tick(): void 
	{
		for (let i = 0; i < this._colliders.length - 1; i++) 
		{
			for (let j = i + 1; j < this._colliders.length; j++) 
			{
				const collider1 = this._colliders[i];
				const collider2 = this._colliders[j];
				if (this._overlap(collider1, collider2)) 
				{
					collider1.handleCollision(collider2);
					collider2.handleCollision(collider1);
				}
			}
		}
	}

	private _overlap(a: ICollider, b: ICollider): boolean
	{
		return !(
			a.x > b.x + b.width ||
			a.x + a.width < b.x ||
			a.y > b.y + b.height ||
			a.y + a.height < b.y
		);
	}
}
