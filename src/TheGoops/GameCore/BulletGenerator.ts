///<reference path="../box2dweb-min.d.ts"/>
///<reference path="../Element/Bullet.ts"/>

class BulletGenerator{

    private static _instance: BulletGenerator;
    private _component: any;


	public static getInstance(): BulletGenerator {
        if (this._instance == null) {
            this._instance = new BulletGenerator();
        }
        return this._instance;
    }

    public generateBullet(game: Core.Game, position: Box2D.Common.Math.b2Vec2, canLength: number, angle: number, radius: number, power: number): void{
    	var opp = Math.abs(Math.sin(angle*(Math.PI / 180))) * canLength;
    	var adj = Math.abs(Math.cos(angle*(Math.PI / 180))) * canLength;
    	/*console.log("----angle:"+angle);
    	console.log("----sin:"+Math.sin(angle*(Math.PI / 180))+" cos:"+Math.cos(angle*(Math.PI / 180)));
    	console.log("----opp:"+opp+" adj:"+adj);*/
    	var x = position.x + adj/2 + radius;
    	var y = position.y - opp/2 - radius;
    	var bullet = new Bullet(game, angle, x, y, radius, power);
    	this.addToComponentList(bullet);
    }

    private addToComponentList(obj: any) {
        if (this._component == null) {
            return;
        }
        if (this._component instanceof Core.GameComponentArray) {
            (<Core.GameComponentArray>this._component).Add(obj);
        } else {
            this._component.push(obj);
        }
    }

    public get Component() { return this._component; }
    public set Component(value) { this._component = value; }

}