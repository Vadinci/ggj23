import { Container } from "pixi.js";
import { Camera } from "./Camera";
import { ITickable } from "./ITickable";
import { TileChunk } from "./TileChunk";

const TILE_SIZE = 8;
const CHUNK_SIZE = 8;

export class TileChunkLayer extends Container implements ITickable
{
	private _camera: Camera;

	private _lastQuadrant = 'n_n';
	private _quadrantMap: Map<string, TileChunk> = new Map();

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

		const newQuadrantMap = new Map<string, TileChunk>();
		for (let iy = row - 2; iy <= row + 2; iy++)
		{
			if (iy < 0) 
			{
				continue;
			}
		
			for (let ix = col - 2; ix <= col + 2; ix++)
			{
				const hash = `${ix}_${iy}`
				if (!this._quadrantMap.get(hash))
				{
					const chunk = new TileChunk(iy * CHUNK_SIZE);
					chunk.x = ix*CHUNK_SIZE*TILE_SIZE;
					chunk.y = iy*CHUNK_SIZE*TILE_SIZE;
					this._quadrantMap.set(hash, chunk)
					this.addChild(chunk);
				}
				newQuadrantMap.set(hash, this._quadrantMap.get(hash)!)
			}
		}

		// Remove existing quadrants that are out of the range surrounding the player
		this._quadrantMap.forEach((tileChunk, hash) => 
		{
			if (!newQuadrantMap.has(hash)) 
			{
				this.removeChild(tileChunk);
				this._quadrantMap.delete(hash);
			}
		});
	}


	private _findCurrentQuadrant(): [col:number, row:number]
	{
		const col = Math.floor(this._camera.x / (TILE_SIZE*CHUNK_SIZE));
		const row = Math.floor(this._camera.y / (TILE_SIZE*CHUNK_SIZE));
		return [col, row];
	}
}