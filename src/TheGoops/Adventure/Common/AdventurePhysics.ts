///<reference path="../../box2dweb-min.d.ts"/>
///<reference path="../../Framework/Input/Mouse.ts"/>
///<reference path="../../Framework/Input/MouseState.ts"/>

class AdventurePhysics {
    private static _instance: AdventurePhysics;
    private _world: Box2D.Dynamics.b2World;
    private _body: Box2D.Dynamics.b2Body;
    private _bodyDef: Box2D.Dynamics.b2BodyDef;
    private _fixture: Box2D.Dynamics.b2FixtureDef;
    private _scale: number = 30;
    private _debugView: Box2D.Dynamics.b2DebugDraw;
    private _mouseJoint: Box2D.Dynamics.Joints.b2Joint;
    private _DEGTORAD: number = 0.0174532925199432957;
    private _RADTODEG: number = 57.295779513082320876;

    // Mouse Stuff
    private _draggableBodies: any[] = [];
    private _laserAffectedBodies: any[] = [];
    private _laserSegment: Box2D.Collision.b2Segment;

    public static getInstance(): AdventurePhysics {
        if (_instance == null) {
            _instance = new AdventurePhysics();
        }
        return _instance;
    }

    createWorld(gravity: Box2D.Common.Math.b2Vec2, allowSleep: bool): void {
        if (this._world == null) {
            this._world = new Box2D.Dynamics.b2World(gravity, allowSleep);
        }
    }

    createCircle(x: number, y: number, radius: number, type: string, userdata: any, rotation: bool, fixDef?: any): Box2D.Dynamics.b2Body {
        this._bodyDef = new Box2D.Dynamics.b2BodyDef;
        this._bodyDef.type = type == 'static' ? Box2D.Dynamics.b2Body.b2_staticBody : Box2D.Dynamics.b2Body.b2_dynamicBody;
        this._bodyDef.position.Set(x, y);
        this._bodyDef.userData = userdata;
        this._bodyDef.fixedRotation = rotation;
        this._bodyDef.allowSleep = (fixDef !== undefined && fixDef.allowSleep) ? fixDef.allowSleep : true;

        this._body = this._world.CreateBody(this._bodyDef);

        var fixture = new Box2D.Dynamics.b2FixtureDef;
        fixture.friction = fixDef !== undefined && fixDef.friction ? fixDef.friction : 0.5;
        fixture.restitution = fixDef !== undefined && fixDef.restitution ? fixDef.restitution : 0.2;
        fixture.density = fixDef !== undefined && fixDef.density ? fixDef.density : 1.0;
        fixture.shape = new Box2D.Collision.Shapes.b2CircleShape(radius);

        this._body.CreateFixture(fixture);
        return this._body;
    }

    createRectangle(x: number, y: number, width: number, height: number, type: string, userdata: any, rotation: bool, fixDef?: any): Box2D.Dynamics.b2Body {
        this._bodyDef = new Box2D.Dynamics.b2BodyDef;
        this._bodyDef.type = type == 'static' ? Box2D.Dynamics.b2Body.b2_staticBody : Box2D.Dynamics.b2Body.b2_dynamicBody;
        this._bodyDef.position.Set(x, y);
        this._bodyDef.userData = userdata;
        this._bodyDef.fixedRotation = rotation;
        this._bodyDef.allowSleep = (fixDef != undefined && fixDef.allowSleep != null) ? fixDef.allowSleep : true;
        this._bodyDef.angle = (fixDef != undefined && fixDef.angle != null) ? fixDef.angle : 0;

        //console.log(this._bodyDef.allowSleep+"  "+fixDef);
        this._body = this._world.CreateBody(this._bodyDef);

        var fixture = new Box2D.Dynamics.b2FixtureDef;
        fixture.friction = (fixDef != undefined && fixDef.friction) ? fixDef.friction : 0.5;
        fixture.restitution = (fixDef != undefined && fixDef.restitution) ? fixDef.restitution : 0.2;
        fixture.density = (fixDef != undefined && fixDef.density) ? fixDef.density : 1.0;
        fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape;
        (<Box2D.Collision.Shapes.b2PolygonShape>fixture.shape).SetAsBox(width / 2, height / 2);

        this._body.CreateFixture(fixture);
        return this._body;
    }

    createJoint(body1: Box2D.Dynamics.b2Body, body2: Box2D.Dynamics.b2Body, type: string, jntOption?: any): any {
        var joint;
        if (type == "Revolute") {
            joint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
            var point = jntOption != undefined && jntOption.jointPoint ? jntOption.jointPoint : body1.GetWorldCenter();
            joint.Initialize(body1, body2, point);
            joint.collideConnected = (jntOption !== undefined && jntOption.collideConected) ? jntOption.collideConected : false;
            //(jntOption !== undefined && jntOption.AnchorA) ? joint.localAnchorA.Set(jntOption.AnchorA.x, jntOption.AnchorA.y) : joint.localAnchorA.Set(0, 0);
            //(jntOption !== undefined && jntOption.AnchorB) ? joint.localAnchorB.Set(jntOption.AnchorB.x, jntOption.AnchorB.y) : joint.localAnchorB.Set(0, 0);
            /*if (jntOption !== undefined && jntOption.enableLimit) {
                joint.enableLimit = jntOption.enableLimit;
                joint.lowerAngle = jntOption.lowerAngle * this._DEGTORAD;
                joint.upperAngle = jntOption.upperAngle * this._DEGTORAD;
            } else {
                joint.enableLimit = false;
            }*/
            if (jntOption != undefined && jntOption.enableMotor) {
                joint.enableMotor = true;
                joint.motorSpeed = jntOption.motorSpeed ? jntOption.motorSpeed : 10;
                joint.maxMotorTorque = jntOption.maxMotorTorque ? jntOption.maxMotorTorque : 20;
            }
        }
        else if (type == "Prismatic") {
            joint = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
            joint.Initialize(body1, body2, body1.GetWorldCenter(), jntOption);
        }
        else if (type == "Pulley") {
            joint = new Box2D.Dynamics.Joints.b2PulleyJointDef();
            (<Box2D.Dynamics.Joints.b2PulleyJointDef>joint).Initialize(body1, body2, jntOption.gA1, jntOption.gA2, jntOption.a1, jntOption.a2, jntOption.ratio);
        }
        //return joint;
        return this._world.CreateJoint(joint);
    }

    activateDebugView(_ctx: CanvasRenderingContext2D, activate: bool): void {
        this._debugView = new Box2D.Dynamics.b2DebugDraw;
        this._debugView.SetSprite(_ctx);
        this._debugView.SetDrawScale(this._scale);
        this._debugView.SetFillAlpha(0.3);
        this._debugView.SetLineThickness(1.0);
        this._debugView.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit || Box2D.Dynamics.b2DebugDraw.e_aabbBit);
        this._world.SetDebugDraw(this._debugView);
    }

    createMouseJoint(x: number, y: number, body?: Box2D.Dynamics.b2Body) {
        if (!this._mouseJoint) {
            body = body == undefined ? this.getBodyAtMouse(x, y) : body;
            if (body) {
                var md = new Box2D.Dynamics.Joints.b2MouseJointDef();
                md.bodyA = this._world.GetGroundBody();
                md.bodyB = body;
                md.target.Set(x, y);
                md.collideConnected = true;
                md.maxForce = 300.0 * body.GetMass();
                this._mouseJoint = this._world.CreateJoint(md);
                body.SetAwake(true);
            }
        }
        else {
            (<Box2D.Dynamics.Joints.b2MouseJoint>this._mouseJoint).SetTarget(new Box2D.Common.Math.b2Vec2(x, y));
        }
    }

    public getBodyAtMouse(x: number, y: number) {
        var mousePVec = new Box2D.Common.Math.b2Vec2(x, y);
        var aabb = new Box2D.Collision.b2AABB();
        aabb.lowerBound.Set(x - 0.001, y - 0.001);
        aabb.upperBound.Set(x + 0.001, y + 0.001);
        // Query the world for overlapping shapes.
        var selectedBody = null;
        this._world.QueryAABB(function (fixture) {
            if (fixture.GetBody().GetType() != Box2D.Dynamics.b2Body.b2_staticBody) {
                if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                    selectedBody = fixture.GetBody();
                    return false;
                }
            }
            return true;
        }, aabb);
        return selectedBody;
    }

    public destroyMouseJoint() {
        if (this._mouseJoint) {
            this._world.DestroyJoint(this._mouseJoint);
            this._mouseJoint = null;
        }
    }

    /*
    * Mouse Detector and Ray Caster
    */
    public updateMouseAction(currMouseState: Input.MouseState, oldMouseState: Input.MouseState) {
        if (currMouseState.LeftButton) {
            if (this._laserSegment != null) {
                return;
            }

            if (this._mouseJoint != null) {
                this.createMouseJoint(currMouseState.X / this._scale, currMouseState.Y / this._scale);
            }

            var body = this.getBodyAtMouse(currMouseState.X / this._scale, currMouseState.Y / this._scale);
            if (body) {
                var isAllowed = false;
                for (var i = 0; i < this._draggableBodies.length; i++) {
                    if ((<Box2D.Dynamics.b2Body>body).GetUserData().ref != undefined && (<Box2D.Dynamics.b2Body>body).GetUserData().ref instanceof this._draggableBodies[i]) {
                        isAllowed = true;
                        break;
                    }
                }
                if (isAllowed) {
                    this.createMouseJoint(currMouseState.X / this._scale, currMouseState.Y / this._scale, body);
                }
            }
        } else {
            this.destroyMouseJoint();
        }
    }

    public updateLaserAction(currMouseState: Input.MouseState, oldMouseState: Input.MouseState) {
        if (this._mouseJoint != null) {
            return;
        }

        if (currMouseState.LeftButton && !oldMouseState.LeftButton) {
            console.log("Begin Laser");
            this._laserSegment = new Box2D.Collision.b2Segment();
            this._laserSegment.p1 = new Box2D.Common.Math.b2Vec2(currMouseState.X / this._scale, currMouseState.Y / this._scale);
        } else if (!currMouseState.LeftButton && oldMouseState.LeftButton) {
            console.log("Finish Laser");
            this._laserSegment = null;
        }
        if (this._laserSegment != null) {
            console.log("Lasring...");
            this._laserSegment.p2 = new Box2D.Common.Math.b2Vec2(currMouseState.X / this._scale, currMouseState.Y / this._scale);
            this._world.RayCast(this.rayCastCallback.bind(this), this._laserSegment.p1, this._laserSegment.p2);
        }
    }

    private rayCastCallback(fixture: Box2D.Dynamics.b2Fixture, point: Box2D.Common.Math.b2Vec2, normal: Box2D.Common.Math.b2Vec2, fraction: number): number {
        var body = fixture.GetBody();
        if (body) {
            var isAllowed = false;
            for (var i = 0; i < this._laserAffectedBodies.length; i++) {
                if ((<Box2D.Dynamics.b2Body>body).GetUserData().ref != undefined && (<Box2D.Dynamics.b2Body>body).GetUserData().ref instanceof this._laserAffectedBodies[i]) {
                    isAllowed = true;
                    break;
                }
            }
            if (isAllowed) {
                (<Box2D.Dynamics.b2Body>body).GetUserData().ref.rayContact(body, point, normal, fraction);
            }
        }
        return 1;
    }

    public drawLaserAction(ctx: CanvasRenderingContext2D, currMouseState: Input.MouseState) {
        if (this._laserSegment) {
            ctx.beginPath();
            ctx.moveTo(this._laserSegment.p1.x * this._scale, this._laserSegment.p1.y * this._scale);
            ctx.lineTo(currMouseState.X, currMouseState.Y);
            ctx.closePath();
            ctx.stroke();
        }
    }

    /* End Of Mouse And Laser Implementation */


    public get MouseJoint() { return this._mouseJoint; }

    public get Scale() { return this._scale; }

    public get World() { return this._world; }

    public get DEGTORAD() { return this._DEGTORAD; }

    public get RADTODEG() { return this._RADTODEG; }

    public get DraggableBodies() { return this._draggableBodies; }

    public get LaserAffectedBodies() { return this._laserAffectedBodies; }
}