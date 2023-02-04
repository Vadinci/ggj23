import { IService } from "./interfaces/IService"

type Services = { [key: string]: IService };

export class Core<T extends Services> 
{
	public readonly services: T;

	public constructor(services: T) 
	{
		this.services = services;
	}

	public async initialize(): Promise<void> 
	{
		await Promise.all(Object.keys(this.services).map((key) => this.services[key].initialize()));
	}
}