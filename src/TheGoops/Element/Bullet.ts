///<reference path="Active.ts"/>

class Bullet extends Active {

	private _physics: Physics;
    private _img: HTMLImageElement;
    private _fw: number;
    private _fh: number;
    private _ctx: CanvasRenderingContext2D;

    constructor(game: Core.Game, angle: number , x: number, y: number, radius: number, power: number) {
    	this._physics = Physics.getInstance();
    	this.name = 'Bullet';
    	this.textureName = "";
    	this._ctx = game.Services.GetService("CanvasRenderingContext2D");
    	
    	this.body = this._physics.createCircle(x, y , radius, 'dynamic', {name : this.name, ref: this}, false,{density: 100});

    	this.entity = new Entity(game,
                                { 'Bullet': { img: game.Content.loadImage("CPBullet.png"), animation: false } },
                                this.body.GetPosition(),
                                this.body.GetAngle(),
                                this.name);
    	this.entity.setTexture("Bullet");

    	this.applyImpulse(this.body, angle, power );


    	super(game);
    }

    Update(gameTime: Core.GameTime) {

        this.entity.update(gameTime, this.body.GetPosition(), this.body.GetAngle());

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

        this.entity.draw(this._ctx);

        super.Draw(gameTime);
    }

    onContact(target: any, impulse: number, method: string): void { }

    /*var applyImpulse = function(body, degrees, power) {
	body.ApplyImpulse(new b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
	Math.sin(degrees * (Math.PI / 180)) * power),
	body.GetWorldCenter());
	};*/

	private applyImpulse(body: Box2D.Dynamics.b2Body, degrees: number, power: number){

		body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power,
		Math.sin(degrees * (Math.PI / 180)) * power),
		body.GetWorldCenter());
	}

}