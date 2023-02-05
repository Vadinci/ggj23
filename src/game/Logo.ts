import { core } from "core";
import gsap from "gsap";
import { Container, Sprite } from "pixi.js";
import { Input } from "./Input";

export class Logo extends Container 
{
	constructor(input: Input)
	{
		super();

		const logo = new Sprite(core.services.content.getTexture('logo'));
		logo.anchor.set(0.5);
		
		this.addChild(logo);
		
		input.onTouchStart.once(()=>
		{
			gsap.to(this, {
				alpha: 0,
				duration: 0.5,
				onComplete: ()=>
				{
					this.destroy();
				}
			})
		}, this);
	}
}