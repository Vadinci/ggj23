import { Container, Graphics, IPointData } from "pixi.js";
import { ITickable } from "./ITickable";

export class PlayerVisual extends Container implements ITickable
{
	private _player: IPointData;

	private _head: Graphics;
	private _branchTicker = 5;

	constructor(player: IPointData)
	{
		super();
		this._player = player;

		this._head = new Graphics().beginFill(0xff0000).drawCircle(0,0,3).endFill();
		this.addChild(this._head);
	}

	public tick(): void
	{
		this._head.x = this._player.x;
		this._head.y = this._player.y;

		this._branchTicker--;
		if (this._branchTicker <= 0)
		{
			this._branchTicker += 5;
			const node: Graphics = new Graphics().beginFill(0xff0000).drawCircle(0,0,1).endFill();
			node.position.copyFrom(this._head);
			this.addChild(node);
		}
	}
}