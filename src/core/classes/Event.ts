type callback<T extends any[]> = (...args: T) => void;

export interface IListenableEvent<T extends any[]> 
{
	listen(callback: callback<T>, context: unknown): void;
	once(callback: callback<T>, context: unknown): void;
	removeListener(callback: callback<T>, context: unknown): void;
}

export interface IFireableEvent<T extends any[]> 
{
	fire(...args: T): void;
}

type EventListener<T extends any[]> = {
	callback: callback<T>;
	context: unknown;
	once: boolean;
}

export class Event<T extends any[]> implements IListenableEvent<T>, IFireableEvent<T> 
{

	private _listeners: EventListener<T>[] = [];

	public constructor() 
	{

	}

	public once(callback: callback<T>, context: unknown): void 
	{
		this._listeners.push({ callback, context, once: true });
	}

	public listen(callback: callback<T>, context: unknown): void 
	{
		this._listeners.push({ callback, context, once: false });
	}

	public removeListener(callback: callback<T>, context: unknown): void 
	{
		const index = this._listeners.findIndex(listener => listener.callback === callback && listener.context === context);
		if (index !== -1) 
		{
			this._listeners.splice(index);
		}
	}

	public fire(...args: T): void 
	{
		const listeners: EventListener<T>[] = [...this._listeners];
		for (let ii = 0; ii < listeners.length; ii++) 
		{
			const listener = listeners[ii];
			listener.callback.call(listener.context, ...args);
		}
		for (let ii = this._listeners.length - 1; ii >= 0; ii--) 
		{
			const listener = this._listeners[ii];
			if (listener.once) 
			{
				this._listeners.splice(ii, 1);
			}
		}
	}
}