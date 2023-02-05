import { core } from "core";
import { Random } from "core/classes/Random";
import { Container, Sprite } from "pixi.js";
import { ITickable } from "./ITickable";

export class Tree extends Container
{
	private _treeHeight: number;

	public get length(): number
	{
		return (this._treeHeight + 1) * 8;
	}

	constructor(height = 1)
	{
		super();
		this._treeHeight = height;
		this._createVisual(height);
	}
	
	private _createVisual(height: number)
	{
		const root = new Sprite(core.services.content.getTexture(`tree_root`));
		root.anchor.set(0.5,1);
		this.addChild(root);

		for(let ii = 0; ii < height; ii++)
		{
			const sprite = new Sprite(core.services.content.getTexture(`tree_${Random.pick(['00','01'])}`));
			sprite.anchor.set(0.5,1);
			sprite.y = -(ii+1)*sprite.height;
			this.addChild(sprite);
		}

		const canopy = new Sprite(core.services.content.getTexture('tree_canopy'));
		canopy.anchor.set(0.5, 0.5);
		canopy.y = -(height+1)*8
		this.addChild(canopy);
		
	}
}