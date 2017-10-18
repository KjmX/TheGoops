///<reference path="../Framework/DrawableGameComponent.ts"/>
///<reference path="Entity.ts"/>
///<reference path="../GameCore/BulletGenerator.ts"/>
///<reference path="../Common/Camera.ts"/>
///<reference path="../GameCore/EventAggregator.ts"/>
///<reference path="../GameCore/Events/CameraMove.ts"/>


class Cannon extends Core.DrawableGameComponent implements IListener {
    private _game : Core.Game;
    private _ctx : CanvasRenderingContext2D;
    private _entityCoreB: Entity;
    private _entityCoreF: Entity;
    private _entityCanon: Entity;
    private _bodyCore: Box2D.Dynamics.b2Body;
    private _bodyCanon: Box2D.Dynamics.b2Body;
    private _nameCore: string;
    private _nameCanon: string;
    private _textureNameCore: any;
    private _textureNameCanon: any;
    private _physics: Physics;
    private _bulletGenerator: BulletGenerator;
    private _imgCore: HTMLImageElement;
    private _imgCanon: HTMLImageElement;
    private _fw: number;
    private _fh: number;
    private _joint: Box2D.Dynamics.Joints.b2Joint;
    private _angle: number;
    private _world : Box2D.Dynamics.b2World;
    private _reload : number;
    private _power: number;
    private _corePosition: Box2D.Common.Math.b2Vec2;
    private _cannonPosition: Box2D.Common.Math.b2Vec2;
    private _camera: Camera;
    private _ea: EventAggregator;

	constructor(game: Core.Game, cvs: HTMLCanvasElement) {
        this._game = game;
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
		this._physics = Physics.getInstance();
        this._bulletGenerator = BulletGenerator.getInstance();
		this._nameCore = 'CCore';
		this._nameCanon = 'CCanon';
        this._angle = -45;
        this._reload = 60;
        this._power = 1000;
        this._corePosition = new Box2D.Common.Math.b2Vec2(10 / this._physics.Scale, (cvs.height - 10) / this._physics.Scale);
        this._cannonPosition = new Box2D.Common.Math.b2Vec2(50 + 10 / this._physics.Scale, (cvs.height - 15) / this._physics.Scale);
        this._camera = Camera.getInstance();
		
		this._bodyCore = this._physics.createCircle(this._corePosition.x, this._corePosition.y, 2, 'static', {name : this._nameCore/*, ref: this*/}, true);
		this._bodyCanon = this._physics.createRectangle(this._cannonPosition.x, this._cannonPosition.y-15, 100 / this._physics.Scale, 20 / this._physics.Scale, 'dynamic', { name: this._nameCanon/*, ref: this*/ }, true, { allowSleep: false });

		var coreFlt = this._bodyCore.GetFixtureList().GetFilterData();
		coreFlt.maskBits = 0x00;
		this._bodyCore.GetFixtureList().SetFilterData(coreFlt);
		var cannonFlt = this._bodyCanon.GetFixtureList().GetFilterData();
		cannonFlt.maskBits = 0x00;
		this._bodyCanon.GetFixtureList().SetFilterData(cannonFlt);

		this._bodyCanon.SetAngle(this._angle * this._physics.DEGTORAD);
		this._joint = this._physics.createJoint(this._bodyCore, this._bodyCanon, 'Revolute', { AnchorB: { x:-2.5 , y: 0}, enableLimit: true, lowerAngle: -80, upperAngle: -10} );
        
        //the back of the cannon
        this._entityCoreB = new Entity(game, { "canB": { img: game.Content.loadImage("canB.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(this._bodyCore.GetPosition().x + 0.9, this._bodyCore.GetPosition().y-1), 0, "CannonBack");
        this._entityCoreB.setTexture("canB");

        //the animation of cannon body
        this._entityCanon = new Entity(game,
                                { 'plant': { img: game.Content.loadImage("canA.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 12, frameW: 100, frameH: 55, frameI: 0, frameSpeed: 10, customize: [1,2,3,4,5,6,7,8,9,10,11,12] } } }
                                , this._bodyCanon.GetPosition()
                                , this._bodyCanon.GetAngle()
                                , "plant");
        this._entityCanon.setTexture("plant");

        //the front of the cannon
        this._entityCoreF = new Entity(game, { "canF": { img: game.Content.loadImage("canF.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(this._bodyCore.GetPosition().x + 0.9, this._bodyCore.GetPosition().y-1), 0, "CannonFront");
        this._entityCoreF.setTexture("canF");

		this._ea = EventAggregator.getInstance();
		this._ea.Subscribe(this, CameraMove);
            
		super(game);
    }

    Initialize(): void { 

    }

    LoadContent(): void { 

    }

    public up(): void {
        if(this._angle > -70){
            this._angle -=1;

            this._bodyCanon.SetAngle( this._angle * this._physics.DEGTORAD);
            console.log(this._bodyCanon.GetPosition());
        }
    }
    public down(): void {
        if(this._angle < -15){
            this._angle +=1;
            this._bodyCanon.SetAngle( this._angle * this._physics.DEGTORAD);
        }
    }

    public shot(): any{
        if(this._reload <=0){
            this._bulletGenerator.generateBullet(this._game, this._bodyCanon.GetPosition(), 150 / this._physics.Scale, this._angle /* this._physics.DEGTORAD*/, 0.5, this._power);
            this._reload = 60;
        }
    }

    Update(gameTime: Core.GameTime) { 
        this._reload--;
        //this._entityCanon.update(gameTime, this._bodyCanon.GetPosition(), this._bodyCanon.GetAngle());
        this._entityCanon.update(gameTime, new Box2D.Common.Math.b2Vec2(this._bodyCanon.GetPosition().x, this._bodyCanon.GetPosition().y + (this._camera.CanvasOffset.y / this._physics.Scale)), this._bodyCanon.GetAngle());
        //this._entityCoreB.update(gameTime, new Box2D.Common.Math.b2Vec2(this._bodyCore.GetPosition().x + 0.9, (this._bodyCore.GetPosition().y - 1)), 0);
        //this._entityCanon.update(gameTime, new Box2D.Common.Math.b2Vec2(this._bodyCanon.GetPosition().x, this._bodyCanon.GetPosition().y), this._bodyCanon.GetAngle());
        //this._entityCoreF.update(gameTime, new Box2D.Common.Math.b2Vec2(this._bodyCore.GetPosition().x + 0.9, (this._bodyCore.GetPosition().y - 1)), 0);
    	super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) { 
        this._entityCoreB.draw(this._ctx);
        this._entityCanon.draw(this._ctx);
        this._entityCoreF.draw(this._ctx);

    	super.Draw(gameTime);
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof CameraMove) {
            this._bodyCore.SetTransform(new Box2D.Common.Math.b2Transform(new Box2D.Common.Math.b2Vec2(this._corePosition.x, this._corePosition.y - (this._camera.CanvasOffset.y / this._physics.Scale)), new Box2D.Common.Math.b2Mat22()));
        }
    }

    /*
    * Method made for re-position the cannon
    */
    public init() {
        if (this._bodyCore) {
            this._bodyCore.SetTransform(new Box2D.Common.Math.b2Transform(this._corePosition, new Box2D.Common.Math.b2Mat22()));
        }
        if (this._bodyCanon) {
            this._angle = -45;
            this._bodyCanon.SetAngle(this._angle * this._physics.DEGTORAD);
        }
    }
}