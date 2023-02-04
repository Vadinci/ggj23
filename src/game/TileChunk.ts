import { core } from "core";
import { Container, Sprite } from "pixi.js";

const TILE_SIZE = 8;

const LAYER_DEPTH = 35;
export class TileChunk extends Container 
{
	constructor(startHeight = 0, width = 16, height = 16)
	{
		super();

		const data = this._createData(startHeight, width, height);
		this._draw(data, width);

		this.cacheAsBitmap = true;
	}

	private _createData(startHeight: number, width: number, height: number): number[] 
	{
		const result: number[] = [];
		for (let iy = startHeight; iy < startHeight + height; iy++)
		{
			for (let ix = 0; ix < width; ix++)
			{
				const offset: number = Math.random()<(iy%LAYER_DEPTH)/(LAYER_DEPTH*1.1)?1:0;
				if (iy === 0)
				{
					result.push(0);
				}
				else if (iy < LAYER_DEPTH)
				{
					result.push(1+offset);
				}
				else if (iy < LAYER_DEPTH * 2)
				{
					result.push(2+offset);
				}
				else if (iy < LAYER_DEPTH * 3)
				{
					result.push(3+offset);
				}
				else if (iy < LAYER_DEPTH * 4)
				{
					result.push(4+offset);
				}
				else if (iy < LAYER_DEPTH * 5)
				{
					result.push(5+offset);
				}
				else if (iy < LAYER_DEPTH * 6)
				{
					result.push(6+offset);
				}
				else if (iy < LAYER_DEPTH * 7)
				{
					result.push(7+offset);
				}
				else
				{
					result.push(8);
				}
			}
		}
		return result;
	}

	private _draw(data: number[], width: number): void
	{
		data.forEach((val, idx) => 
		{
			const picture: Sprite = new Sprite(core.services.content.getTexture(`tile_0${val}${Math.random()<0.03?"_alt":""}`));
			const x = (idx % width) * TILE_SIZE; 
			const y = Math.floor(idx / width) * TILE_SIZE; 
			picture.x = x;
			picture.y = y;
			this.addChild(picture);
		})
	}
}