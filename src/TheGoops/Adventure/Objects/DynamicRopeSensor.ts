///<reference path="../../Framework/DrawableGameComponent.ts"/>
///<reference path="../Common/AdventurePhysics.ts"/>
///<reference path="AdventurePlayer.ts"/>
///<reference path="Rope.ts"/>
///<reference path="../../GameCore/Events/RopeCutted.ts"/>

class DynamicRopeSensor extends Core.DrawableGameComponent implements IListener {

    private _physics: AdventurePhysics;
    private _x: number;
    private _y: number;
    private _radius: number;
    private _body: Box2D.Dynamics.b2Body;
    private _sensorFix: Box2D.Dynamics.b2Fixture;
    private _rope: Rope;
    private _game: Core.Game;
    private _create: bool;
    private _with: Box2D.Dynamics.b2Body;
    private _ea: EventAggregator;
    private _entity: Entity;
    private _circleEntity: Entity;
    private _ctx: CanvasRenderingContext2D;

    constructor(game: Core.Game, x: number, y: number, radius: number) {
        super(game);

        this._physics = AdventurePhysics.getInstance();
        this._x = x;
        this._y = y;
        this._radius = radius;
        this._game = game;
        this._create = false;
        this._ea = EventAggregator.getInstance();
        this._ea.Subscribe(this, RopeCutted);
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");

        this.myDRS();
    }

    private myDRS() {
        this._body = this._physics.createCircle(this._x / this._physics.Scale, this._y / this._physics.Scale, 0.4, 'static', { name: "DycRopeBd", ref: this }, true);
        var fixDef = new Box2D.Dynamics.b2FixtureDef();
        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(this._radius);
        fixDef.isSensor = true;
        this._sensorFix = this._body.CreateFixture(fixDef);

        this._entity = new Entity(this._game, { "DRS": { img: this._game.Content.loadImage("sensorSmall.png"), animation: false } }, this._body.GetPosition(), this._body.GetAngle(), "DRS");
        this._entity.setTexture("DRS");

        this._circleEntity = new Entity(this._game, { "DRSC": { img: this._game.Content.loadImage("sensorCircleB.png"), animation: false } }, this._body.GetPosition(), this._body.GetAngle(), "DRSC");
        this._circleEntity.setTexture("DRSC");
    }

    Update(gameTime: Core.GameTime) {
        if (this._rope != null) {
            this._rope.Update(gameTime);
        } else if (this._create) {
            this._rope = new Rope(this._game, this._body, this._with);
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

        if (this._circleEntity != null) {
            this._circleEntity.draw(this._ctx);
        }

        if (this._entity != null) {
            this._entity.draw(this._ctx);
        }

        if (this._rope != null) {
            this._rope.Draw(gameTime);
        }
        super.Draw(gameTime);
    }

    onContact(target: any, impulse: number, method: string): void {
        if (method == "BEGIN") {
            if (target.ref != null && target.ref instanceof AdventurePlayer && !this._create) {
                this._create = true;
                this._with = (<AdventurePlayer>target.ref).Body;
            }
        }
    }

    public Dispose() {
        if (this._rope) {
            this._rope.Dispose();
        }
        this._physics.World.DestroyBody(this._body);
        this._entity = null;
        this._circleEntity = null;
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof RopeCutted) {
            if ((<RopeCutted>sub).Rope == this._rope) {
                this._rope = null;
                this.setEnabled(false);
            }
        }
    }
}