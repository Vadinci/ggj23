import { core } from "core";
import { Random } from "core/classes/Random";
import { Container } from "pixi.js";
import { Collisions } from "./Collisions";
import { ITickable } from "./ITickable";
import { Obstacle } from "./Obstacle";
import { Player } from "./Player";
import { SpriteEffect } from "./SpriteEffect";

const CHUNK_SIZE = 24;

export const OBSTACLES: string[] = [
	'Water',
	'Nutrients',
	'Bone',
	'Stone',
	'Stone_Alt',
	'Saw',
	'Oil'
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
		for (let iy = row - 4; iy <= row + 8; iy++)
		{
			if (iy < 3) 
			{
				continue;
			}
		
			for (let ix = col - 4; ix <= col + 4; ix++)
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
		const tags: string[]= OBSTACLES.concat([]);

		tags.push(OBSTACLES[Math.min(OBSTACLES.length - 1, Math.floor(row/10))]);
		tags.push(OBSTACLES[Math.min(OBSTACLES.length - 1, Math.floor(row/10))]);
		tags.push(OBSTACLES[Math.min(OBSTACLES.length - 1, Math.floor(row/6))]);
		tags.push(OBSTACLES[Math.min(OBSTACLES.length - 1, Math.floor(row/4))]);
	
		const tag = Random.pick(tags);


		const obstacle = new Obstacle(tag);
		obstacle.x = Random.float(col, col+1)*CHUNK_SIZE;
		obstacle.y = Random.float(row, row+1)*CHUNK_SIZE;

		obstacle.onCollect.listen(this._handleObstacleCollect, this);
		
		this._collisions.addCollider(obstacle);
		this._obstacles.set(hash, obstacle);
		this._world.addChild(obstacle);
	}

	public removeObstacle(obstacle: Obstacle)
	{
		this._world.removeChild(obstacle);
		this._collisions.removeCollider(obstacle);
		obstacle.onCollect.removeListener(this._handleObstacleCollect, this);
	}

	private _findCurrentChunk(): [col:number, row:number]
	{
		const col = Math.floor(this._player.x / (CHUNK_SIZE));
		const row = Math.floor(this._player.y / (CHUNK_SIZE));
		return [col, row];
	}

	private _handleObstacleCollect(obstacle: Obstacle, withPlayer: boolean): void
	{
		this.removeObstacle(obstacle);
		if (!withPlayer) 
		{
			return;
		}
		// find the obstacle in the map of type <string, Obstacle> and change it's entry to null
		this._obstacles.forEach((value, key) => 
		{
			if (value === obstacle) 
			{
				this._obstacles.set(key, null);
			}
		});

		let effectName = "object_hit";
		let sfxName = Random.pick(["sfx_hit","sfx_hit_alt"]);
		
		if (obstacle.tag === "Water")
		{
			effectName = "water_hit";
			sfxName = "sfx_water";
		}
		if (obstacle.tag === "Nutrients")
		{
			effectName = "nutrition_hit";
			sfxName = "sfx_speed_up";
		}

		const sfx = core.services.content.getSound(sfxName);
		sfx.volume(0.4);
		sfx.play();


		// spawn effect
		const effect = new SpriteEffect(effectName, 0.2, { width: 16, height: 16 });
		this._world.addChild(effect.sprite);
		effect.play(()=>
		{
			this._world.removeChild(effect.sprite);
		});

		effect.sprite.x = obstacle.x + obstacle.width/2;
		effect.sprite.y = obstacle.y + obstacle.height/2;
	}
}