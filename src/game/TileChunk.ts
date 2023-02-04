import { core } from "core";
import { Container, Sprite } from "pixi.js";

const TILE_SIZE = 8;

export class TileChunk extends Container 
{
	constructor(data: number[], width = 16)
	{
		super();

		this._draw(data, width);

		this.cacheAsBitmap = true;
	}

	private _draw(data: number[], width: number): void
	{
		data.forEach((val, idx) => 
		{
			const picture: Sprite = new Sprite(core.services.content.getTexture("tile_01"));
			const x = (idx % width) * TILE_SIZE; 
			const y = Math.floor(idx / width) * TILE_SIZE; 
			picture.x = x;
			picture.y = y;
			this.addChild(picture);
		})
	}
}