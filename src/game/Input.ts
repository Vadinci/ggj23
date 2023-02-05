import { core } from "core";
import { Event } from "core/classes/Event";
import log from "loglevel";
import { Container, InteractionEvent, Point } from "pixi.js";

const logger = log.getLogger("Input");

export class Input 
{
	public onTouchStart: Event<[]> = new Event();
	public onTouchEnd: Event<[]> = new Event();

	private _container: Container;
	private _listeners: {event: string; handler: () => void}[] = [];

	private _activePointer = -1;
	private _touchPosition = new Point(0,0);

	public get isTouching(): boolean 
	{
		return this._activePointer !== -1;
	}

	public get x(): number 
	{
		return this._touchPosition.x;
	}

	public get y(): number 
	{
		return this._touchPosition.y;
	}

	constructor(targetContainer: Container) 
	{
		this._container = targetContainer;
	}

	public enable(): void
	{
		this._container.interactive = true;
		this._registerListener("pointerdown", this._handlePointerDown);
		this._registerListener("pointermove", this._handlePointerMove);
		this._registerListener("pointerup", this._handlePointerUp);
		this._registerListener("pointerupoutside", this._handlePointerUp);
	}

	public disable(): void
	{
		this._container.interactive = false;
		this._cleanUpListeners();
	}

	private _registerListener(event: string, handler: (...args: any[]) => void): void
	{
		this._container.on(event, handler, this);
		this._listeners.push({ event, handler });
	}

	private _cleanUpListeners(): void
	{
		this._listeners.forEach(listener => 
		{
			this._container.off(listener.event, listener.handler, this);
		});
		this._listeners = [];
	}

	private _setTouchPositionFromEvent(e: InteractionEvent): void
	{
		this._touchPosition.copyFrom(e.data.getLocalPosition(this._container));
		
		this._touchPosition.x -= core.services.app.app.screen.width/2;
		this._touchPosition.y -= core.services.app.app.screen.height/2;
		
		logger.debug(`(${this._touchPosition.x},${this._touchPosition.y})`);
	}

	private _handlePointerDown(e: InteractionEvent): void
	{
		if (this._activePointer !== -1)
		{
			logger.debug("secondary pointer detected");
			return;
		}
		logger.debug("input started");
		this._activePointer = e.data.identifier;
		this._setTouchPositionFromEvent(e);
		this.onTouchStart.fire();
	}

	private _handlePointerMove(e: InteractionEvent): void
	{
		if (this._activePointer === - 1)
		{
			return;
		}
		if (this._activePointer !== e.data.identifier)
		{
			logger.debug("secondary pointer detected");
			return;
		}
		logger.debug("input moved");
		this._setTouchPositionFromEvent(e);
	}

	private _handlePointerUp(e: InteractionEvent): void
	{
		if (this._activePointer !== e.data.identifier)
		{
			logger.debug("secondary pointer detected");
			return;
		}
		logger.debug("input ended");
		this._activePointer = -1;

		this.onTouchEnd.fire();
	}
}