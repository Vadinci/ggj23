import { Application, IApplicationOptions, Ticker } from "pixi.js";
import { IService } from "../interfaces/IService";

export class AppService implements IService 
{
	private _app: Application;
	public get app(): Application 
	{
		return this._app 
	}
	public get ticker(): Ticker 
	{
		return this._app.ticker
	}
 
	constructor(options?: IApplicationOptions) 
	{
		this._app = new Application(options); 
	}

	public async initialize(): Promise<void> 
	{
		document.body.appendChild(this._app.renderer.view);
	}
}