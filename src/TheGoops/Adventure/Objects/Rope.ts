///<reference path="../../Framework/DrawableGameComponent.ts"/>
///<reference path="../Common/AdventurePhysics.ts"/>
///<reference path="../../Framework/Input/Mouse.ts"/>
///<reference path="../../Framework/Input/MouseState.ts"/>
///<reference path="../../GameCore/Events/RopeCutted.ts"/>

class Rope extends Core.DrawableGameComponent {

    private _game: Core.Game;
    private _physics: AdventurePhysics;
    private _width: number;
    private _bodyArray: Box2D.Dynamics.b2Body[];
    private _jointArray: Box2D.Dynamics.Joints.b2Joint[];
    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _laserSegment: Box2D.Collision.b2Segment;
    private _ctx: CanvasRenderingContext2D;
    private _jx: number;
    private _jy: number;
    private _isFirstBody: bool;
    private _entityArray: Entity[];

    constructor(game: Core.Game, bodyA: Box2D.Dynamics.b2Body, bodyB: Box2D.Dynamics.b2Body) {
        super(game);

        this._game = game;
        this._physics = AdventurePhysics.getInstance();
        this._width = 0.5;
        this._bodyArray = [];
        this._jointArray = [];
        this._oldMouseState = Input.Mouse.GetState();
        this._laserSegment = null;
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._isFirstBody = true;
        this._entityArray = [];

        this.myRope(bodyA, bodyB);
    }

    private myRope(attachBodyA: Box2D.Dynamics.b2Body, attachBodyB: Box2D.Dynamics.b2Body) {
        var distanceVect = new Box2D.Common.Math.b2Vec2(attachBodyB.GetPosition().x, attachBodyB.GetPosition().y);
        distanceVect.Subtract(attachBodyA.GetPosition());
        distanceVect.Normalize();
        distanceVect.Multiply(this._width);
        var nextBodyPosition = new Box2D.Common.Math.b2Vec2(attachBodyA.GetPosition().x, attachBodyA.GetPosition().y /*- this._width*/);
        var distVec = new Box2D.Common.Math.b2Vec2(attachBodyA.GetPosition().x - attachBodyB.GetPosition().x, attachBodyA.GetPosition().y - attachBodyB.GetPosition().y);
        var dist = distVec.Length();
        var prevBody = attachBodyA;
        var tempBody;
        for (var i = 0; i < Math.ceil((dist / (this._width))); ++i) {

            tempBody = this.createRope(nextBodyPosition, tempBody, distanceVect, this._width);
            if (this._isFirstBody) {
                this._jointArray.push(
                    this._physics.createJoint(prevBody, tempBody, "Revolute")
                );
                this._isFirstBody = false;
            } else {
                this._jointArray.push(
                    this._physics.createJoint(prevBody, tempBody, "Revolute", { jointPoint: new Box2D.Common.Math.b2Vec2(this._jx, this._jy) })
                );

            }

            this._entityArray.push(new Entity(this._game, { "Rope": { img: this._game.Content.loadImage("ropeBody.png"), animation: false } }, tempBody.GetPosition(), tempBody.GetAngle(), "Rope"));
            this._entityArray[i].setTexture("Rope");

            this._bodyArray.push(tempBody);
            prevBody = tempBody;
        }
        //prevBody = this.createRope(nextBodyPosition, prevBody, distanceVect, 0.6);

        this._jointArray.push(
                this._physics.createJoint(prevBody, attachBodyB, "Revolute", { jointPoint: new Box2D.Common.Math.b2Vec2(this._jx, this._jy) })
            );
    }

    Update(gameTime: Core.GameTime) {
        /*this._currMouseState = Input.Mouse.GetState();
        if (this._currMouseState.LeftButton && !this._oldMouseState.LeftButton) {
            this._laserSegment = new Box2D.Collision.b2Segment();
            this._laserSegment.p1 = new Box2D.Common.Math.b2Vec2(this._currMouseState.X / this._physics.Scale, this._currMouseState.Y / this._physics.Scale);
            console.log("Create new one");
        }
        if (!this._currMouseState.LeftButton && this._oldMouseState.LeftButton) {
            console.log("Finish with it");
            this._laserSegment = null;
        }
        if (this._laserSegment) {
            console.log(">>>>>>>>>>Laser<<<<<<<<<<<<");
            this._laserSegment.p2 = new Box2D.Common.Math.b2Vec2(this._currMouseState.X / this._physics.Scale, this._currMouseState.Y / this._physics.Scale);
            this._physics.World.RayCast(this.cutTheRope.bind(this), this._laserSegment.p1, this._laserSegment.p2);
        }

        this._oldMouseState = this._currMouseState;*/

        for (var i = 0; i < this._entityArray.length; ++i) {
            this._entityArray[i].update(gameTime, this._bodyArray[i].GetPosition(), this._bodyArray[i].GetAngle());
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

        /*if (this._laserSegment) {
            this._ctx.beginPath();
            this._ctx.moveTo(this._laserSegment.p1.x * this._physics.Scale, this._laserSegment.p1.y * this._physics.Scale);
            this._ctx.lineTo(this._currMouseState.X, this._currMouseState.Y);
            this._ctx.closePath();
            this._ctx.stroke();
        }*/
        for (var i = 0; i < this._entityArray.length; ++i) {
            this._entityArray[i].draw(this._ctx);
        }

        super.Draw(gameTime);
    }



    private createRope(nxtBPos: Box2D.Common.Math.b2Vec2, tmpB: any, distVect: Box2D.Common.Math.b2Vec2, width: number): Box2D.Dynamics.b2Body {
        nxtBPos.Add(new Box2D.Common.Math.b2Vec2(distVect.x, distVect.y));
        var angle = Math.atan2(distVect.y, distVect.x);
        tmpB = this._physics.createRectangle(nxtBPos.x, nxtBPos.y, width, 0.125, 'dynamic', { name: "Rope.js", ref: this }, false, { angle: angle });
        var fd = tmpB.GetFixtureList().GetFilterData();
        fd.maskBits = 0x00;
        tmpB.GetFixtureList().SetFilterData(fd);
        var opp = Math.abs(Math.sin(angle)) * width / 2;
        var adj = Math.abs(Math.cos(angle)) * width / 2;

        if ((angle * this._physics.RADTODEG) < 90 && (angle * this._physics.RADTODEG) >= 0) {
            var jx = nxtBPos.x - adj;
            var jy = nxtBPos.y - opp;
        }
        if ((angle * this._physics.RADTODEG) >= 90 && (angle * this._physics.RADTODEG) < 180) {
            var jx = nxtBPos.x + adj;
            var jy = nxtBPos.y - opp;
        }
        if ((angle * this._physics.RADTODEG) < -90 && (angle * this._physics.RADTODEG) >= -180) {
            var jx = nxtBPos.x + adj;
            var jy = nxtBPos.y + opp;
        }
        if ((angle * this._physics.RADTODEG) >= -90 && (angle * this._physics.RADTODEG) < 0) {
            var jx = nxtBPos.x - adj;
            var jy = nxtBPos.y + opp;
        }
        this._jx = jx;
        this._jy = jy;

        return tmpB;
    }

    private rayContact(body: Box2D.Dynamics.b2Body, point: Box2D.Common.Math.b2Vec2, normal: Box2D.Common.Math.b2Vec2, fraction: number): void {
        if (body) {
            if (body.GetUserData().ref != undefined && body.GetUserData().ref == this) {
                this.Dispose();
            }
        }
        this._laserSegment = null;
    }

    public Dispose(): void {
        for (var i = 0; i < this._jointArray.length; i++) {
            this._physics.World.DestroyJoint(this._jointArray[i]);
            this._jointArray[i] = null;
        }
        /*for (var i = 0; i < this._bodyArray.length; i++) {
            this._physics.World.DestroyBody(this._bodyArray[i]);
            this._bodyArray[i] = null;
        }*/
        this._jointArray.length = 0;
        EventAggregator.getInstance().Publish(new RopeCutted(this));
    }
}