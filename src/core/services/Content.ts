import { Loader, LoaderResource } from "@pixi/loaders";
import { IService } from "../interfaces/IService";
import { Event } from "../classes/Event";
import { Texture } from "@pixi/core";
import YAML from "yaml";
import log from "loglevel";

export type ContentRequest = [nameOrUrl: string, name?: string];

const logger = log.getLogger("Content");
export interface LoaderProgress 
{
	readonly count: number;
	readonly loaded: number;
	onProgress: Event<[loader: LoaderProgress]>;
	complete: Promise<void>;
}


export class ContentService implements IService 
{
	private _basePath: string;
	private _resources: { [extension: string]: { [key: string]: LoaderResource } } = {};

	constructor(basePath = "") 
	{
		this._basePath = basePath;
	}

	public async initialize(): Promise<void> 
	{
		//
	}

	public getTexture(key: string): Texture 
	{
		const texture = this._resources["png"]?.[key].texture;
		if (!texture) 
		{
			throw new Error(`resource ${key} is not loaded or is not a texture`); // @TODO improve
		}
		return texture;
	}

	public getYaml(key: string): any 
	{
		const data = this._resources["yaml"]?.[key].data;
		if (!data) 
		{
			throw new Error(`resource ${key} is not loaded or is not a data`); // @TODO improve
		}
		return YAML.parse(data);
	}

	public load(requests: ContentRequest[]): LoaderProgress 
	{
		const loader: Loader = new Loader(this._basePath);
		requests.forEach(req => 
		{
			const url = req[0];
			let name = req[1];
			if (!name) 
			{
				name = url.split(".")[0];
			}
			loader.add(name, url);
		});

		const progress = {
			count: requests.length,
			loaded: 0,
			onProgress: new Event<[LoaderProgress]>(),
			complete: new Promise<void>((resolve, reject) => 
			{
				loader.onComplete.once(() => resolve());
			})
		};

		loader.onLoad.add(() => 
		{
			progress.count++;
			progress.onProgress.fire(progress);
		});

		loader.onComplete.once(() => 
		{
			loader.onLoad.detachAll();
			Object.keys(loader.resources).forEach(key => 
			{
				const resource = loader.resources[key];
				const extension = resource.extension;
				logger.info(resource);
				this._resources[extension] = this._resources[extension] ?? [];
				if (this._resources[extension][resource.name]) 
				{
					logger.warn(`resource with duplicate name: ${resource.name} ${resource.url}. This resource can not be retrieved via get[Resource] methods!`);
				}
				else 
				{
					this._resources[extension][resource.name] = resource;
				}
			});
		});

		loader.onError.add(err => 
		{
			throw err;
		});

		loader.load();

		return progress;
	}
}