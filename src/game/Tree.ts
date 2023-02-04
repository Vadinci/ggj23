import { core } from "core";
import { Random } from "core/classes/Random";
import { Container, Sprite } from "pixi.js";
import { ITickable } from "./ITickable";

export class Tree extends Container implements ITickable
{
	private _baseAngle = 0;
	private _vangular = 0.3;
	private _angleShake = 0;
	constructor(height = 1)
	{
		super();
		this._createVisual(height);
	}

	tick(): void 
	{
		this._baseAngle -= this._vangular;
		this._vangular *= 0.98;
		this._angleShake += 0.03;
		this._angleShake *= 0.95;

		this.angle = this._baseAngle + Math.random()*this._angleShake - this._angleShake/2;
	}
	
	private _createVisual(height: number)
	{
		for(let ii = 0; ii < height; ii++)
		{
			const sprite = new Sprite(core.services.content.getTexture(`tree_${Random.pick(['00','01'])}`));
			sprite.anchor.set(0.5,1);
			sprite.y = -ii*sprite.height;
			this.addChild(sprite);
		}

		const canopy = new Sprite(core.services.content.getTexture('tree_canopy'));
		canopy.anchor.set(0.5, 0.5);
		canopy.y = -height*8
		this.addChild(canopy);
		
	}
}