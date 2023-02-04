import { Container, Graphics, IPointData, Point } from "pixi.js";
import { ITickable } from "./ITickable";
import { Player, PlayerState } from "./Player";

export class RootVisual extends Container implements ITickable
{
	private _player: Player;

	private _head: Graphics;
	private _branchTicker = 15;
	private _lastBranchNode: Point = new Point();

	constructor(player: Player)
	{
		super();
		this._player = player;

		this._head = new Graphics().beginFill(0xff0000).drawCircle(0,0,1).endFill();
		this.addChild(this._head);
		this._lastBranchNode.copyFrom(this._player);
	}

	public tick(): void
	{
		if (this._player.state !== PlayerState.DIGGING)
		{
			return;
		}
		
		this._head.x = this._player.x;
		this._head.y = this._player.y;

		this._branchTicker--;
		if (this._branchTicker <= 0)
		{
			this._branchTicker += 15;
			const branch: Graphics = new Graphics()
				.lineStyle(1,0xff0000)
				.moveTo(this._head.x, this._head.y)
				.lineTo(this._lastBranchNode.x, this._lastBranchNode.y);
			this._lastBranchNode.copyFrom(this._head)
			this.addChild(branch);
		}
	}
}