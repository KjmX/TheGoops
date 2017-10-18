///<reference path="../Interfaces/IPhysics.ts"/>

class Physics implements IPhysics {

    private static _instance: Physics;
    private _world: Box2D.Dynamics.b2World;
    private _body: Box2D.Dynamics.b2Body;
    private _bodyDef: Box2D.Dynamics.b2BodyDef;
    private _fixture: Box2D.Dynamics.b2FixtureDef;
    private _scale: number = 30;
    private _debugView: Box2D.Dynamics.b2DebugDraw;
    private _mouseJoint: Box2D.Dynamics.Joints.b2Joint;
    private _DEGTORAD : number = 0.0174532925199432957;
    private _RADTODEG: number = 57.295779513082320876;

    public static getInstance(): Physics {
        if (_instance == null) {
            _instance = new Physics();
        }
        return _instance;
    }

    createWorld(gravity: Box2D.Common.Math.b2Vec2, allowSleep: bool): void {
        if (this._world == null) {
            this._world = new Box2D.Dynamics.b2World(gravity, allowSleep);
        }
    }

    createCircle(x: number, y: number, radius: number, type: string, userdata: any, rotation: bool, fixDef?: any): Box2D.Dynamics.b2Body
    {
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

    createRectangle(x: number, y: number, width: number, height: number, type: string, userdata: any, rotation: bool, fixDef?: any): Box2D.Dynamics.b2Body
    {
        this._bodyDef = new Box2D.Dynamics.b2BodyDef;
        this._bodyDef.type = type == 'static' ? Box2D.Dynamics.b2Body.b2_staticBody : Box2D.Dynamics.b2Body.b2_dynamicBody;
        this._bodyDef.position.Set(x, y);
        this._bodyDef.userData = userdata;
        this._bodyDef.fixedRotation = rotation;
        this._bodyDef.allowSleep = (fixDef !== undefined && fixDef.allowSleep != null) ? fixDef.allowSleep : true;

        //console.log(this._bodyDef.allowSleep+"  "+fixDef);
        this._body = this._world.CreateBody(this._bodyDef);

        var fixture = new Box2D.Dynamics.b2FixtureDef;
        fixture.friction = (fixDef !== undefined && fixDef.friction) ? fixDef.friction : 0.5;
        fixture.restitution = (fixDef !== undefined && fixDef.restitution) ? fixDef.restitution : 0.2;
        fixture.density = (fixDef !== undefined && fixDef.density) ? fixDef.density : 1.0;
        fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape;
        (<Box2D.Collision.Shapes.b2PolygonShape>fixture.shape).SetAsBox(width  / 2, height / 2);

        this._body.CreateFixture(fixture);
        return this._body;
    }

    createJoint(body1: Box2D.Dynamics.b2Body, body2: Box2D.Dynamics.b2Body, type: string, jntOption?: any): any
    {
        var joint;
        if (type == "Revolute") {
            joint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
            joint.bodyA = body1;
            joint.bodyB = body2;
            joint.collideConnected = (jntOption !== undefined && jntOption.collideConected) ? jntOption.collideConected : false;
            (jntOption !== undefined && jntOption.AnchorA) ? joint.localAnchorA.Set(jntOption.AnchorA.x, jntOption.AnchorA.y) : joint.localAnchorA.Set(0,0);
            (jntOption !== undefined && jntOption.AnchorB) ? joint.localAnchorB.Set(jntOption.AnchorB.x, jntOption.AnchorB.y) : joint.localAnchorB.Set(0,0);
            //joint.enableLimit = (jntOption !== undefined && jntOption.enableLimit) ? jntOption.enableLimit : false;
            if(jntOption !== undefined && jntOption.enableLimit)
            {
                joint.enableLimit= jntOption.enableLimit;
                joint.lowerAngle = jntOption.lowerAngle * this._DEGTORAD;
                joint.upperAngle = jntOption.upperAngle * this._DEGTORAD;
            }
            else { joint.enableLimit = false; }
            /*joint.enableMotor=true;
            joint.maxMotorTorque =20;
            joint.motorSpeed =-45 * this._DEGTORAD;*/
            //joint.Initialize(body1, body2, /*body1.GetWorldCenter()*/vec);
        }
        else if (type == "Prismatic") {
            joint = new Box2D.Dynamics.Joints.b2PrismaticJointDef();
            joint.Initialize(body1, body2, body1.GetWorldCenter(), jntOption);
        }
        //return joint;
        return this._world.CreateJoint(joint);
    }

    activateDebugView(_ctx: CanvasRenderingContext2D, activate: bool): void
    {
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

    public get MouseJoint() { return this._mouseJoint; }

    public get Scale() { return this._scale; }

    public get World() { return this._world; }

    public get DEGTORAD() { return this._DEGTORAD; }

    public get RADTODEG() { return this._RADTODEG; }


}