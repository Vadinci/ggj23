import { Container, Graphics, IPointData, Point, Sprite } from "pixi.js";
import { ITickable } from "./ITickable";
import { Player, PlayerState } from "./Player";
import { SpriteEffect } from "./SpriteEffect";

export class SeedVisual extends Container implements ITickable
{
	private _player: Player;

	private _seed!: SpriteEffect;
	private _lastPos: Point = new Point();

	constructor(player: Player)
	{
		super();
		this._player = player;
		this._lastPos.copyFrom(this._player);
	}

	public tick(): void
	{	
		if (!this._seed)
		{
			this._seed = new SpriteEffect('seed', 0.2, { width: 16, height: 5 });
			this._seed.sprite.loop = true;
			this._seed.sprite.anchor.set(1,0.5);
			this._seed.play();
			this.addChild(this._seed.sprite);
		}
		this._seed.sprite.x = this._player.x;
		this._seed.sprite.y = Math.min(this._player.y, 0);

		this._seed.sprite.rotation = Math.atan2(this._player.y - this._lastPos.y, this._player.x - this._lastPos.x);

		this._lastPos.copyFrom(this._player);
	}
}