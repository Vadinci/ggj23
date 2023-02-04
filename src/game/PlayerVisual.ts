import { Container, Graphics, IPointData } from "pixi.js";
import { ITickable } from "./ITickable";

export class PlayerVisual extends Container implements ITickable
{
	private _player: IPointData;

	constructor(player: IPointData)
	{
		super();
		this._player = player;

		const graphics: Graphics = new Graphics().beginFill(0xff0000).drawCircle(0,0,3).endFill();
		this.addChild(graphics);
	}

	public tick(): void
	{
		this.x = this._player.x;
		this.y = this._player.y;
	}
}