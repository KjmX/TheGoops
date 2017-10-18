///<reference path="../../Framework/DrawableGameComponent.ts"/>
///<reference path="../Common/AdventurePhysics.ts"/>
///<reference path="../../Element/Entity.ts"/>
///<reference path="../../GameCore/EventAggregator.ts"/>
///<reference path="../../GameCore/Events/AdventureLevelDone.ts"/>

class BigMama extends Core.DrawableGameComponent {

    private _game: Core.Game;
    private _physics: AdventurePhysics;
    private _x: number;
    private _y: number;
    private _points: number;
    private _body: Box2D.Dynamics.b2Body;
    private _entity: Entity;
    private _ctx: CanvasRenderingContext2D;
    private _ea: EventAggregator;

    constructor(game: Core.Game, x: number, y: number) {
        super(game);

        this._game = game;
        this._physics = AdventurePhysics.getInstance();
        this._x = x;
        this._y = y;
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._ea = EventAggregator.getInstance();

        this.myBigMama();
    }

    private myBigMama() {
        this._body = this._physics.createCircle(this._x / this._physics.Scale, this._y / this._physics.Scale, 0.5, 'static', { name: "BigMama", ref: this }, true);
        var fd = this._body.GetFixtureList().GetFilterData();
        fd.maskBits = 0x0;
        this._body.GetFixtureList().SetFilterData(fd);
        var fixDef = new Box2D.Dynamics.b2FixtureDef();
        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(0.6);
        fixDef.isSensor = true;
        this._body.CreateFixture(fixDef);

        this._entity = new Entity(this._game, { "BigMama": { img: this._game.Content.loadImage("blueBon.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 10, frameW: 60, frameH: 60, frameI: 0, frameSpeed: 35 } } }, this._body.GetPosition(), this._body.GetAngle(), "BigMama");
        this._entity.setTexture("BigMama");
    }

    Update(gameTime: Core.GameTime) {
        this._entity.update(gameTime, this._body.GetPosition(), this._body.GetAngle());
        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        this._entity.draw(this._ctx);
        super.Draw(gameTime);
    }

    Dispose(): void {
        this._physics.World.DestroyBody(this._body);
        this._ea.Publish(new AdventureRemoveFromComponent(this));
    }

    onContact(target: any, impulse: number, method: string): void {
        if (target.ref != undefined && target.ref instanceof AdventurePlayer) {
            this._ea.Publish(new AdventureLevelDone(target.ref));
            //this.Dispose();
        }
    }
}