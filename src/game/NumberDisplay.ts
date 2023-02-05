import { core } from 'core';
import { Container, Rectangle, Sprite, Texture } from 'pixi.js';

const NUMBERS: string[] = [
	'num_0',
	'num_1',
	'num_2',
	'num_3',
	'num_4',
	'num_5',
	'num_6',
	'num_7',
	'num_8',
	'num_9',
];

const WIDTH = 5;
const HEIGHT = 8;
const PADDING = 2;

export class NumberDisplay extends Container 
{
	private readonly _numberSprites: Sprite[] = [];

	constructor(value: number) 
	{
		super();
		this.displayNumber(value);
	}

	public displayNumber(value: number): void 
	{
		const texture = core.services.content.getTexture('numbers');

		this.removeChildren();
		const stringValue = value.toString();
		const totalWidth = (WIDTH + PADDING) * stringValue.length - PADDING;
		let position = -totalWidth / 2;
		for (const character of stringValue) 
		{
			const char = parseInt(character);
			const frame = new Texture(texture.baseTexture, new Rectangle(WIDTH*char, 0, WIDTH, HEIGHT));
			const sprite = new Sprite(frame);
			sprite.anchor.set(0.5);
			sprite.x = position;
			position += WIDTH + PADDING;
			this.addChild(sprite);
		}
	}

}