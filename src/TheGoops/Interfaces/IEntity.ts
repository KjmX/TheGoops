///<reference path="../box2dweb-min.d.ts"/>

interface IEntity {
    update(gameTime: Core.GameTime, position: Box2D.Common.Math.b2Vec2, angle: number): void;
    draw(ctx: CanvasRenderingContext2D): void;
    Position: Box2D.Common.Math.b2Vec2;  //TODO: change this to vector2d
    Angle: number;
    Texture: { [name: string]: any; };
    Name: string;
    setTexture(textureName: string): void;
}