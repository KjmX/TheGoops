///<reference path="../../Framework/DrawableGameComponent.ts"/>
///<reference path="../Common/AdventurePhysics.ts"/>
///<reference path="../../GameCore/Events/AdventureRemoveFromComponent.ts"/>

class Star extends Core.DrawableGameComponent {

    private _game: Core.Game;
    private _physics: AdventurePhysics;
    private _x: number;
    private _y: number;
    private _points: number;
    private _body: Box2D.Dynamics.b2Body;
    private _entity: Entity;
    private _ctx: CanvasRenderingContext2D;
    private _ea: EventAggregator;
    private _dispose: bool;

    constructor(game: Core.Game, x: number, y: number) {
        super(game);

        this._game = game;
        this._physics = AdventurePhysics.getInstance();
        this._x = x;
        this._y = y;
        this._points = 1000;
        this._dispose = false;
        this._ea = EventAggregator.getInstance();
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");

        this.myStar();
    }

    private myStar() {
        this._body = this._physics.createCircle(this._x / this._physics.Scale, this._y / this._physics.Scale, 0.2, 'static', { name: "Star", ref: this }, true);
        var fd = this._body.GetFixtureList().GetFilterData();
        fd.maskBits = 0x0;
        this._body.GetFixtureList().SetFilterData(fd);
        var fixDef = new Box2D.Dynamics.b2FixtureDef();
        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape(0.3);
        fixDef.isSensor = true;
        this._body.CreateFixture(fixDef);

        this._entity = new Entity(this._game, { "Star": { img: this._game.Content.loadImage("starSheet1.png"), animation: false } }, this._body.GetPosition(), this._body.GetAngle(), "Star");
        this._entity.setTexture("Star");
    }

    Update(gameTime: Core.GameTime) {
        if (this._dispose) {
            this.Dispose();
            this._dispose = false;
        }

        /*if (this._entity) {
            this._entity.update(gameTime, this._body.GetPosition(), this._body.GetAngle());
        }*/

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

        if (this._entity) {
            this._entity.draw(this._ctx);
        }

        super.Draw(gameTime);
    }

    Dispose(): void {
        this._physics.World.DestroyBody(this._body);
        this._ea.Publish(new AdventureRemoveFromComponent(this));
    }

    onContact(target: any, impulse: number, method: string): void {
        if (target.ref != undefined && target.ref instanceof AdventurePlayer) {
            this._dispose = true;
            this._points = 0;
        }
    }

    public get Points() { return this._points; }
}