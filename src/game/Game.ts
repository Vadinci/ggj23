import { core } from "core";
import { Random } from "core/classes/Random";
import { ContentRequest } from "core/services/Content";
import gsap from "gsap";
import log from "loglevel";
import { Container, Point, Rectangle } from "pixi.js";
import { Camera } from "./Camera";
import { CloudLayer } from "./CloudLayer";
import { Collisions } from "./Collisions";
import { Input } from "./Input";
import { ITickable } from "./ITickable";
import { LaunchController } from "./LaunchController";
import { OBSTACLES, ObstacleSpawner } from "./ObstacleSpawner";
import { Player } from "./Player";
import { RootVisual } from "./RootVisual";
import { SeedVisual } from "./SeedVisual";
import { SpriteEffect } from "./SpriteEffect";
import { TileLayer } from "./TileLayer";
import { Tree } from "./Tree";

const logger = log.getLogger("Game");

export enum GameState 
{
	BOOTUP,
	LAUNCHING,
	FLYING,
	DIGGING,
	PANNING
}

export class Game 
{
	private _inputContainer: Container;
	private _input: Input;
	private _launchController: LaunchController;
	private _collisions: Collisions;
	private _obstacleSpawner: ObstacleSpawner;

	private _world: Container;

	private _player: Player;
	private _rootVisual: RootVisual;
	private _seedVisual: SeedVisual;
	private _tileLayer: TileLayer;
	private _cloudLayer: CloudLayer;
	private _activeTree!: Tree;

	private _camera: Camera;

	private _state: GameState = GameState.BOOTUP;

	private _tickables: ITickable[] = [];

	private _lastLandPosition: Point = new Point();

	constructor()
	{
		this._inputContainer = new Container();
		this._input = new Input(this._inputContainer);

		this._world = new Container();

		this._inputContainer.hitArea = new Rectangle(-5000, -5000, 10000, 10000);

		this._player = new Player(this._input);
		this._rootVisual = new RootVisual(this._player);
		this._seedVisual = new SeedVisual(this._player);

		this._camera = new Camera(this._world);

		this._collisions = new Collisions();
		this._collisions.addCollider(this._player);
		this._tickables.push(this._collisions);
		
		this._tileLayer = new TileLayer(this._camera);
		this._world.addChild(this._tileLayer);
		this._tickables.push(this._tileLayer);
	
		this._cloudLayer = new CloudLayer(this._camera);
		this._world.addChild(this._cloudLayer);
		this._tickables.push(this._cloudLayer);

		this._launchController = new LaunchController(this._input);
		this._tickables.push(this._launchController);

		this._obstacleSpawner = new ObstacleSpawner(this._world, this._player, this._collisions);
		this._tickables.push(this._obstacleSpawner);

	}

	public async start(parent: Container): Promise<void>
	{
		await core.services.content.load([
			...Array.from({ length: 9 }, (v, i) => 
			{
				return [`tiles/T_Tile_0${i}.png`,`tile_0${i}`]
			}) as ContentRequest[],
			...Array.from({ length: 9 }, (v, i) => 
			{
				return [`tiles/T_Tile_0${i}_Alt.png`,`tile_0${i}_alt`]
			}) as ContentRequest[],
			...Array.from({ length: 7 }, (v, i) => 
			{
				return [`misc/T_Misc_Cloud_0${i}.png`,`cloud_0${i}`]
			}) as ContentRequest[],

			["sprites/S_Hand_22x24@6.png","hand"],
			["objects/T_Object_Tree_00.png","tree_00"],
			["objects/T_Object_Tree_01.png","tree_01"],
			["objects/T_Object_TreeCanopy.png","tree_canopy"],

			...OBSTACLES.map(key => [`objects/T_Object_${key}.png`, `obstacle_${key}`] as ContentRequest),

			["sprites/S_ObjectHit_16x16@4.png","object_hit"],
			["sprites/S_Impact_16x16@4.png","impact"],
			["sprites/S_Launch_16x16@4.png","launch"],
		]).complete;

		parent.addChild(this._world);
		parent.addChild(this._inputContainer);
		this._input.enable();

		core.services.app.ticker.add(this._onTick, this);

		this._tickables.push(this._player);
		this._tickables.push(this._camera);

		this._activeTree = new Tree(3);
		this._world.addChild(this._activeTree);

		this._startLaunch();
	}

	public stop(): void
	{
		core.services.app.ticker.remove(this._onTick, this);
		this._inputContainer.parent.removeChild(this._inputContainer);
	}

	private _onTick(): void
	{
		this._tickables.forEach(tickable => tickable.tick());
	}

	private _startFlying(): void
	{
		this._player.onHitGround.once(()=>
		{
			this._lastLandPosition.copyFrom(this._player);
			this._startDigging();
		}, this);

		this._camera.setTarget(this._player);

		const tree = this._activeTree;
		const launchPos = new Point(
			tree.x - Math.cos(tree.rotation+Math.PI/2)*tree.length,
			tree.y - Math.sin(tree.rotation+Math.PI/2)*tree.length,
		)

		this._player.launch(launchPos, new Point(5,-5));

		// spawn effect
		const effect = new SpriteEffect("launch", 0.2, { width: 16, height: 16 });
		this._world.addChild(effect.sprite);
		effect.play(()=>
		{
			this._world.removeChild(effect.sprite);
		});

		effect.sprite.position.copyFrom(launchPos);
		

		this._tickables.push(this._seedVisual);
		this._world.addChild(this._seedVisual);

		this._state = GameState.FLYING;

		const checkPosition = () => 
		{
			if (this._player.y < -150) 
			{
				this._rootVisual.disable();
				return;
			}
			requestAnimationFrame(checkPosition);
		};
	
		checkPosition();
	}

	private _startDigging(): void
	{
		this._tickables.splice(this._tickables.indexOf(this._seedVisual),1);

		this._rootVisual.enable();
		this._tickables.push(this._rootVisual);
		this._world.addChild(this._rootVisual);

		this._player.onStopped.once(()=>
		{
			this._panToTree();
		}, this);

		this._state = GameState.DIGGING;

		// spawn effect
		const effect = new SpriteEffect("impact", 0.2, { width: 16, height: 16 });
		this._world.addChild(effect.sprite);
		effect.play(()=>
		{
			this._world.removeChild(effect.sprite);
		});

		effect.sprite.position.copyFrom(this._lastLandPosition);
		effect.sprite.y -= 8;
	}

	private _panToTree(): void 
	{
		// Stop updating the root visual
		this._tickables.splice(this._tickables.indexOf(this._rootVisual), 1);

		this._world.removeChild(this._activeTree);
		this._activeTree = new Tree(1+Math.floor(Math.pow(this._player.score,0.7)/10));
		this._activeTree.position.copyFrom(this._lastLandPosition);
		this._world.addChild(this._activeTree);

		// Create a new camera target
		const newCameraTarget = new Container();
		newCameraTarget.x = this._camera.x;
		newCameraTarget.y = this._camera.y;
		this._world.addChild(newCameraTarget);
		this._camera.setTarget(newCameraTarget);

		// Animate the target to the last land position
		gsap.to(newCameraTarget, {
			x: this._lastLandPosition.x,
			y: this._lastLandPosition.y - 30,
			duration: 2,
			onComplete: () => 
			{
				this._world.removeChild(newCameraTarget);
				this._startLaunch();
			}
		});

		this._state = GameState.PANNING;
	}

	private _startLaunch(): void
	{
		this._state = GameState.LAUNCHING;
		this._launchController.enable(this._activeTree);

		this._launchController.onFire.once(()=>
		{
			this._launchController.disable();
			this._startFlying();
		},this);
	}
}