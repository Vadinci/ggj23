import { Random } from "core/classes/Random";
import { Container, Point } from "pixi.js";
import { Collisions } from "./Collisions";
import { ITickable } from "./ITickable";
import { Obstacle } from "./Obstacle";
import { Player } from "./Player";

const CHUNK_SIZE = 24;
const RANGE = 3;

export const OBSTACLES: string[] = [
	'Water',
	'Nutrients',
	'Bone',
	'Stone',
	'Stone_Alt',
	'Oil',
	'Saw'
]

export class ObstacleSpawner implements ITickable 
{
	private _obstacles: Map<string, Obstacle | null> = new Map();

	private _world: Container;
	private _player: Player;
	private _collisions: Collisions;

	private _lastChunk = "n_n";

	constructor(world: Container, player: Player, collisions: Collisions)
	{
		this._world = world;
		this._player = player;
		this._collisions = collisions;
	}

	public tick(): void 
	{
		const [col, row] = this._findCurrentChunk();
		if (this._lastChunk === `${col}_${row}`)
		{
			return;
		}
		this._lastChunk = `${col}_${row}`;

		const newObstacleMap = new Map<string, true>();
		for (let iy = row - RANGE; iy <= row + RANGE; iy++)
		{
			if (iy < 2) 
			{
				continue;
			}
		
			for (let ix = col - RANGE; ix <= col + RANGE; ix++)
			{
				const hash = `${ix}_${iy}`
				if (!this._obstacles.has(hash))
				{
					this.createObstacle(ix, iy, hash)
				}
				newObstacleMap.set(hash, true)
			}
		}

		// Remove existing quadrants that are out of the range surrounding the player
		this._obstacles.forEach((obstacle, hash) => 
		{
			if (!newObstacleMap.has(hash)) 
			{
				if (obstacle)
				{
					this.removeObstacle(obstacle);
				}
				this._obstacles.delete(hash);
			}
		});
	}

	public createObstacle(col: number, row: number, hash: string)
	{
		if (Random.bool(0.5)) 
		{
			this._obstacles.set(hash, null);
			return;
		}

		const index = Math.min(Math.floor(Math.abs(row * 0.02) * OBSTACLES.length), OBSTACLES.length - 1);
		const tag = Random.pick(OBSTACLES.slice(index));

		const obstacle = new Obstacle(tag);
		obstacle.x = Random.float(col, col+1)*CHUNK_SIZE;
		obstacle.y = Random.float(row, row+1)*CHUNK_SIZE;
		
		this._obstacles.set(hash, obstacle);
		this._world.addChild(obstacle);
	}

	public removeObstacle(obstacle: Obstacle)
	{
		this._world.removeChild(obstacle);
		this._collisions.removeCollider(obstacle);
	}

	private _findCurrentChunk(): [col:number, row:number]
	{
		const col = Math.floor(this._player.x / (CHUNK_SIZE));
		const row = Math.floor(this._player.y / (CHUNK_SIZE));
		return [col, row];
	}
}