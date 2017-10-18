///<reference path="../box2dweb-min.d.ts"/>

interface IBody {
    Body: Box2D.Dynamics.b2Body;
    Name: string;
    Dispose(): void;
    onContact(target: any, impulse: number, method: string): void;
    // entity, sound
}