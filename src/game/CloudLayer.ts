import { core } from "core";
import { Random } from "core/classes/Random";
import { Container, Sprite } from "pixi.js";
import { Camera } from "./Camera";
import { ITickable } from "./ITickable";

const CHUNK_SIZE = 48;
const RANGE = 4;

export class CloudLayer extends Container implements ITickable 
{
	private _clouds: Map<string, Sprite> = new Map();
	private _camera: Camera;
	private _lastQuadrant = "n_n";

	constructor(camera: Camera)
	{
		super();
		this._camera = camera;
	}

	public tick(): void 
	{
		const [col, row] = this._findCurrentQuadrant();
		if (this._lastQuadrant === `${col}_${row}`)
		{
			return;
		}
		this._lastQuadrant = `${col}_${row}`;

		const newQuadrantMap = new Map<string, Sprite>();
		for (let iy = row - RANGE; iy <= row + RANGE; iy++)
		{
			if (iy > -2) 
			{
				continue;
			}
		
			for (let ix = col - RANGE; ix <= col + RANGE; ix++)
			{
				const hash = `${ix}_${iy}`
				if (!this._clouds.get(hash))
				{
					const cloud = this._getCloudSprite();
					cloud.x = ix*CHUNK_SIZE+Math.floor(Math.random()*CHUNK_SIZE);
					cloud.y = iy*CHUNK_SIZE+Math.floor(Math.random()*CHUNK_SIZE);
					this._clouds.set(hash, cloud);
					if (Math.random()<0.7) 
					{
						cloud.visible = false;
					}
					cloud.scale.set(1.5);
					cloud.alpha = Random.pick([0.5, 0.75, 1]);
					
					this.addChild(cloud);
				}
				newQuadrantMap.set(hash, this._clouds.get(hash)!)
			}
		}

		// Remove existing quadrants that are out of the range surrounding the player
		this._clouds.forEach((cloud, hash) => 
		{
			if (!newQuadrantMap.has(hash)) 
			{
				this.removeChild(cloud);
				this._clouds.delete(hash);
			}
		});
	}


	private _getCloudSprite(): Sprite
	{
		return new Sprite(core.services.content.getTexture(`cloud_0${Math.floor(Math.random()*7)}`));
	}

	private _findCurrentQuadrant(): [col:number, row:number]
	{
		const col = Math.floor(this._camera.x / (CHUNK_SIZE));
		const row = Math.floor(this._camera.y / (CHUNK_SIZE));
		return [col, row];
	}
}