import { core } from 'core';
import { AnimatedSprite, Texture, Rectangle, ISize } from 'pixi.js';

export class SpriteEffect 
{
	private _sprite: AnimatedSprite;
	private _speed: number;
	private _frameSize: ISize;

	constructor(textureName: string, speed: number, frameSize: ISize) 
	{
		const texture = core.services.content.getTexture(textureName);
		this._speed = speed;
		this._frameSize = frameSize;
		this._sprite = new AnimatedSprite(this._buildFrames(texture));
		this._sprite.animationSpeed = this._speed;
		this._sprite.anchor.set(0.5);
		this._sprite.loop = false;
	}

	private _buildFrames(texture: Texture): Texture[] 
	{
		const frames: Texture[] = [];
		const frameCountX = texture.width / this._frameSize.width;
		const frameCountY = texture.height / this._frameSize.height;
		for (let y = 0; y < frameCountY; y++) 
		{
			for (let x = 0; x < frameCountX; x++) 
			{
				const frame = new Texture(texture.baseTexture, new Rectangle(x * this._frameSize.width, y * this._frameSize.height, this._frameSize.width, this._frameSize.height));
				frames.push(frame);
			}
		}
		return frames;
	}

	public play(onComplete?: () => void): void 
	{
		this.sprite.onComplete = () => 
		{
			if (onComplete) 
			{
				onComplete();
			}
		};
		this.sprite.play();
	}

	public get sprite(): AnimatedSprite 
	{
		return this._sprite;
	}
}
