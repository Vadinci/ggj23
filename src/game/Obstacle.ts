import { core } from "core";
import { Event } from "core/classes/Event";
import { Container, Sprite } from "pixi.js";
import { ICollider } from "./Collisions";

export class Obstacle extends Container implements ICollider 
{
	public readonly tag: string;
	public onCollect: Event<[obstacle:this]> = new Event();

	constructor(tag: string)
	{
		super();

		this.tag = tag;
		this.addChild(new Sprite(core.services.content.getTexture(`obstacle_${tag}`)));
	}
	
	handleCollision(other: ICollider): void 
	{
		this.onCollect.fire(this);
	}

	
}