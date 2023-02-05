import { Random } from "core/classes/Random";
import { BaseTexture, Container, Graphics, Point, RenderTexture, Sprite, Texture } from "pixi.js";
import { ITickable } from "./ITickable";
import { Player } from "./Player";

const CHUNK_SIZE = 128;
const ROOT_COLOR = "#d9ffc0";
const BRANCH_COLOR = "#e5d286";
const HEAD_COLOR = "#6aff4c";

type Walker = {
	life: number;
	angle: number;
	x: number;
	y: number;
	speed: number;
}
export class RootVisual extends Container implements ITickable
{
	private _player: Player;
	private _walkers: Walker[] = [];
	private _walkerCountdown = 100;
	private _oldPos: Point = new Point();

	private _visualChunks: Map<string, {
		tex: Texture;
		ctx: CanvasRenderingContext2D;
		dirty: boolean;
	}> = new Map();

	constructor(player: Player)
	{
		super();
		this._player = player;
	}

	public enable(): void
	{
		this._oldPos.copyFrom(this._player);
		this._walkerCountdown = 100;
	}

	public disable(): void 
	{
		this.removeChildren();
		this._visualChunks.forEach(val=>
		{
			val.tex.destroy(true);
		})
		this._walkers = [];
		this._visualChunks.clear();
	}

	public tick(): void
	{
		this._draw(this._oldPos.x | 0, this._oldPos.y | 0, 2, ROOT_COLOR);

		const dx = this._player.x - this._oldPos.x;
		const dy = this._player.y - this._oldPos.y;

		this._oldPos.copyFrom(this._player);

		this._walkerCountdown--;

		if (Random.bool(0.05) && this._walkerCountdown < 0 && this._player.speed > 0.3 )
		{
			const walker: Walker = {
				life: Random.int(50,250),
				angle: Math.atan2(dy, dx)+Random.pick([-Math.PI/2, Math.PI/2]),
				x: this._player.x,
				y: this._player.y,
				speed: 1,
			}

			this._walkerCountdown = 60;
			this._walkers.push(walker);
		}

		this._walkers.forEach(walker => 
		{
			walker.x += Math.cos(walker.angle)*walker.speed;
			walker.y += Math.sin(walker.angle)*walker.speed;
			walker.speed *= 0.995;
			walker.angle += Random.float(-0.2,0.2);
			walker.life--;
			this._draw(walker.x | 0, walker.y | 0, 1, BRANCH_COLOR);
		});

		this._walkers = this._walkers.filter(walker => walker.life > 0);

		const newWalkers: Walker[] = [];
		this._walkers.forEach(walker => 
		{
			if (walker.life > 40 && Random.bool(0.03))
			{
				const newWalker = { ...walker };
				newWalkers.push(newWalker);
				newWalker.life /=2;
				newWalker.angle += Random.pick([-Math.PI/2, Math.PI/2])
			}
		});
		this._walkers = this._walkers.concat(newWalkers);
		this._draw(this._player.x | 0, this._player.y | 0, 1, HEAD_COLOR);

		this._visualChunks.forEach(chunk => 
		{
			if (chunk.dirty)
			{
				chunk.tex.update();
			}
		})
	}

	private _draw(x: number,y: number, size: number, color: string): void
	{
		const chunk = this._getChunkForCoords(x,y);

		chunk.ctx.fillStyle = color;
		chunk.ctx.fillRect(x%CHUNK_SIZE - size/2|0, y%CHUNK_SIZE - size/2|0, size, size);
		chunk.dirty = true;
	}

	private _getChunkForCoords(x: number, y: number): {
		tex: Texture;
		ctx: CanvasRenderingContext2D;
		dirty: boolean;
	} 
	{
		const col = Math.floor(x/CHUNK_SIZE);
		const row = Math.floor(y/CHUNK_SIZE);

		const hash = `${col}_${row}`;
		if (!this._visualChunks.has(hash))
		{
			const canvas = document.createElement('canvas');
			canvas.width = CHUNK_SIZE;
			canvas.height = CHUNK_SIZE;
			
			const ctx = canvas.getContext('2d')!;

			const tex = Texture.from(canvas);
			const sprite = new Sprite(tex);
			this.addChild(sprite);
			sprite.x = col*CHUNK_SIZE;
			sprite.y = row*CHUNK_SIZE;

			this._visualChunks.set(hash, { ctx, tex, dirty: false });

		}

		return this._visualChunks.get(hash)!;
	}
}