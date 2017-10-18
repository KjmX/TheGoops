///<reference path="../../Framework/DrawableGameComponent.ts"/>
///<reference path="../Common/AdventurePhysics.ts"/>

class Pulley extends Core.DrawableGameComponent {

    private _physics: AdventurePhysics;
    private _length: number;
    private _x: number;
    private _y: number;
    private _game: Core.Game;
    private _ctx: CanvasRenderingContext2D;
    private bodyA: Box2D.Dynamics.b2Body;
    private bodyB: Box2D.Dynamics.b2Body;
    private _blocker: Box2D.Dynamics.b2Body;
    private _hook1: Box2D.Dynamics.b2Body;
    private _hook2: Box2D.Dynamics.b2Body;
    private _j1: any;
    private _j2: any;
    private _pJoint: any;
    private _blockerEntity: Entity;
    private _kofa1Entity: Entity;
    private _kofa2Entity: Entity;

    constructor(game: Core.Game, x: number, y: number, length: number) {
        super(game);

        this._physics = AdventurePhysics.getInstance();
        this._game = game;
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._length = length;
        this._x = x;
        this._y = y;
        this.myPulley();
    }

    private myPulley() {
        var bodyA = this._physics.createRectangle((this._x - 50) / this._physics.Scale, (this._y + this._length) / this._physics.Scale, 75 / this._physics.Scale, 19 / this._physics.Scale, 'dynamic', "9ofa1", false);
        var bodyB = this._physics.createRectangle((this._x + 50) / this._physics.Scale, (this._y + this._length) / this._physics.Scale, 75 / this._physics.Scale, 19 / this._physics.Scale, 'dynamic', "9ofa2", false);
        this.bodyA = bodyA;
        this.bodyB = bodyB;

        var gA1 = new Box2D.Common.Math.b2Vec2(bodyA.GetWorldCenter().x, bodyA.GetWorldCenter().y - (this._length / this._physics.Scale));
        var gA2 = new Box2D.Common.Math.b2Vec2(bodyB.GetWorldCenter().x, bodyB.GetWorldCenter().y - (this._length / this._physics.Scale));

        var blocker = this._physics.createRectangle(gA2.x - (gA2.x - gA1.x) / 2, gA1.y, (gA2.x - gA1.x), 20 / this._physics.Scale, 'static', "PulleyBlocker", true);
        this._blocker = blocker;

        var hook1 = this._physics.createCircle(gA1.x, gA1.y, 0.2, 'static', "PulleyHook1", true);
        var hook2 = this._physics.createCircle(gA2.x, gA2.y, 0.2, 'static', "PulleyHook2", true);

        this._hook1 = hook1;
        this._hook2 = hook2;

        var fd = hook1.GetFixtureList().GetFilterData();
        fd.maskBits = 0x0;
        hook1.GetFixtureList().SetFilterData(fd);

        fd = hook2.GetFixtureList().GetFilterData();
        fd.maskBits = 0x0;
        hook2.GetFixtureList().SetFilterData(fd);

        var j1 = this._physics.createJoint(bodyA, hook1, 'Prismatic', new Box2D.Common.Math.b2Vec2(0, 1));
        var j2 = this._physics.createJoint(bodyB, hook2, 'Prismatic', new Box2D.Common.Math.b2Vec2(0, 1));

        this._j1 = j1;
        this._j2 = j2;

        var pJoint = this._physics.createJoint(bodyA, bodyB, 'Pulley', { gA1: gA1, gA2: gA2, a1: bodyA.GetWorldCenter(), a2: bodyB.GetWorldCenter(), ratio: 1.0 });

        this._pJoint = pJoint;

        this._blockerEntity = new Entity(this._game, { "PulleyBlocker": { img: this._game.Content.loadImage("pulleyRe.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(blocker.GetPosition().x, blocker.GetPosition().y - (10 / this._physics.Scale)), blocker.GetAngle(), "PulleyBlocker");
        this._blockerEntity.setTexture("PulleyBlocker");

        this._kofa1Entity = new Entity(this._game, { "Pulley9ofa1": { img: this._game.Content.loadImage("9ofaRe.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(bodyA.GetPosition().x, bodyA.GetPosition().y - (9 / this._physics.Scale)), bodyA.GetAngle(), "9ofa1");
        this._kofa1Entity.setTexture("Pulley9ofa1");
        this._kofa2Entity = new Entity(this._game, { "Pulley9ofa2": { img: this._game.Content.loadImage("9ofaRe.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(bodyB.GetPosition().x, bodyB.GetPosition().y - (9 / this._physics.Scale)), bodyB.GetAngle(), "9ofa2");
        this._kofa2Entity.setTexture("Pulley9ofa2");
    }

    Update(gameTime: Core.GameTime) {
        if (this._kofa1Entity) {
            this._kofa1Entity.update(gameTime, new Box2D.Common.Math.b2Vec2(this.bodyA.GetPosition().x, this.bodyA.GetPosition().y - (9 / this._physics.Scale)), this.bodyA.GetAngle());
        }
        if (this._kofa2Entity) {
            this._kofa2Entity.update(gameTime, new Box2D.Common.Math.b2Vec2(this.bodyB.GetPosition().x, this.bodyB.GetPosition().y - (9 / this._physics.Scale)), this.bodyB.GetAngle());
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

        if (this._blockerEntity) {
            this._blockerEntity.draw(this._ctx);
        }

        if (this._kofa1Entity) {
            this._kofa1Entity.draw(this._ctx);
        }

        if (this._kofa2Entity) {
            this._kofa2Entity.draw(this._ctx);
        }

        super.Draw(gameTime);
    }

    public Dispose() {
        this._physics.World.DestroyJoint(this._j1);
        this._physics.World.DestroyJoint(this._j2);
        this._physics.World.DestroyJoint(this._pJoint);
        this._physics.World.DestroyBody(this.bodyA);
        this._physics.World.DestroyBody(this.bodyB);
        this._physics.World.DestroyBody(this._blocker);
        this._physics.World.DestroyBody(this._hook1);
        this._physics.World.DestroyBody(this._hook2);
    }
}