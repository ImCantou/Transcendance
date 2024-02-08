import { Point } from "./Point";

export class Paddle {
	public pos: Point;
	public upKey: Boolean = false;
	public downKey: Boolean = false;
	public isFrozen: Boolean = false;
	public isGiant: Boolean = false;
	
	private freezeTimer: number;
	private giantTimer: number;

	public width: number;
	public height: number;

	private lastUpdate: number = (new Date()).getTime();	

	constructor(side: "home" | "away") {	
		this.height = 100;
		this.width = 4;
		
		if (side === "home") this.pos = new Point(40, 350);
		else if (side === "away") this.pos = new Point(760 - this.width, 350);
	}

	public isCheatedPosition(key: string): boolean {
		const now = (new Date()).getTime();

		if (now - this.lastUpdate < 10 || (key !== "UpPress" && key !== "DownPress" && key !== "UpRelease" && key !== "DownRelease"))
			return (true);
		return (false);
	}

	public freeze() {
		this.isFrozen = true;
		this.freezeTimer = (new Date()).getTime();
	}

	public giant() {
		this.isGiant = true;
		this.height = 180;
		this.pos.y -= 40;
		this.giantTimer = (new Date()).getTime();
	}

	public updatePowerUp() {
		let time: number = (new Date()).getTime();

		if (this.isFrozen && time - this.freezeTimer >= 5000)
			this.isFrozen = false;
		if (this.isGiant && time - this.giantTimer >= 5000)
		{	
			this.isGiant = false;
			this.pos.y += 40;
			this.height = 100;
		}
	}

	public newPosition(key: string): void {
		this.lastUpdate = (new Date()).getTime();
		switch(key)
		{
			case "UpPress": 
				this.upKey = true;
				this.downKey = false;
				break;
			case "UpRelease":
				this.upKey = false;
				break;
			case "DownPress":
				this.downKey = true;
				this.upKey = false;
				break;
			case "DownRelease":
				this.downKey = false;
				break;
		}
	}
}
