///<reference path="../box2dweb-min.d.ts"/>

interface IPhysics {
    World: Box2D.Dynamics.b2World;

    //Body: Box2D.Dynamics.b2BodyDef;

    //Fixture: Box2D.Dynamics.b2FixtureDef;

    Scale: number;

    //DebugView: Box2D.Dynamics.b2DebugDraw;

    createWorld(gravity: Box2D.Common.Math.b2Vec2, allowSleep: bool): void;

    createCircle(x: number, y: number, radius: number, type: string, userdata: any, rotation: bool, fixDef?: any): Box2D.Dynamics.b2Body;

    createRectangle(x: number, y: number, width: number, height: number, type: string, userdata: any, rotation: bool, fixDef?: any): Box2D.Dynamics.b2Body;

    activateDebugView(_ctx: CanvasRenderingContext2D, activate: bool): void;

    createJoint(body1: Box2D.Dynamics.b2Body, body2: Box2D.Dynamics.b2Body, type: string): any;

    createMouseJoint(x: number, y: number, body?: Box2D.Dynamics.b2Body): void;
}