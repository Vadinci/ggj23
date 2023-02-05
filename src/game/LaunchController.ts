import { DisplayObject, Point } from "pixi.js";
import { Input } from "./Input";
import { core } from "core";
import { ContentRequest } from "core/services/Content";
import { ITickable } from "./ITickable";
import { Event } from "core/classes/Event";
import gsap from "gsap";

export class LaunchController implements ITickable
{
	public onFire: Event<[]> = new Event();
	private _input: Input;
	private _tree?: DisplayObject;

	private _touchStart?: Point;
	private _dist = 0;

	constructor(input: Input)
	{
		this._input = input;
	}

	public tick(): void
	{
		if (!this._tree)
		{
			return;
		}
		if (!this._touchStart)
		{
			this._tree.angle *= 0.7;
			return;
		}

		const dx = this._input.x - this._touchStart.x;
		const dy = this._input.y - this._touchStart.y;

		this._dist = Math.sqrt(dx ** 2 + dy ** 2);

		this._tree.angle = -Math.sqrt(this._dist*2) * (Math.PI);
	}

	public enable(tree: DisplayObject): void
	{
		this._tree = tree;

		this._input.onTouchStart.listen(this._handleTouchStart, this);
		this._input.onTouchEnd.listen(this._handleTouchEnd, this);
	}

	public disable(): void
	{
		this._tree = undefined;

		this._input.onTouchStart.removeListener(this._handleTouchStart, this);
		this._input.onTouchEnd.removeListener(this._handleTouchEnd, this);
	}

	private _handleTouchStart(): void
	{
		this._touchStart = new Point().copyFrom(this._input);

		const sfx = core.services.content.getSound('sfx_boot');
		sfx.volume(1);
		sfx.play();
	}

	private _handleTouchEnd(): void
	{
		this._touchStart = undefined;

		if (this._dist > 20)
		{
			const tree = this._tree!;
			this._tree = undefined;

			gsap.to(tree, {
				angle: 0,
				duration: 1,
				ease: "elastic.out(1, 0.2)"
			});

			this.onFire.fire();
		}
	}
}
