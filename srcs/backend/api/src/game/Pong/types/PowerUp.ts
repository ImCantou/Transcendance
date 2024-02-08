import { Point } from "./Point";

export type PowerUpType = 'Freeze' | 'Giant' | 'SpeedUp';

export class PowerUp {
    public type: PowerUpType;
	public pos: Point;
	public rad: number;

	public readonly spawnedAt: number = (new Date()).getTime();

	constructor(height: number)
	{
		this.rad = 60;

		let rand : number = Math.floor(Math.random() * 3);
		if (rand == 0)
			this.type = 'Freeze'
		else if (rand == 1)
			this.type = 'Giant'
		else
			this.type = 'SpeedUp'

		rand = 50 + Math.floor(Math.random() * (height - 100));
		this.pos = {x: 400, y: rand}
	}


}