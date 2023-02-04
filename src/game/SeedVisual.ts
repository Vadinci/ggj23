import { Container, Graphics, IPointData, Point } from "pixi.js";
import { ITickable } from "./ITickable";
import { Player, PlayerState } from "./Player";

export class SeedVisual extends Container implements ITickable
{
	private _player: Player;

	private _head: Graphics;

	constructor(player: Player)
	{
		super();
		this._player = player;

		this._head = new Graphics().beginFill(0xff0000).drawCircle(0,0,1).endFill();
		this.addChild(this._head);
	}

	public tick(): void
	{	
		this._head.x = this._player.x;
		this._head.y = this._player.y;
	}
}