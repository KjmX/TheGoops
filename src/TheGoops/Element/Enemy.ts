///<reference path="Active.ts"/>
///<reference path="../Interfaces/IEnemy.ts"/>
///<reference path="../Common/Physics.ts"/>
///<reference path="../GameCore/EffectGenerator.ts"/>

class Enemy extends Active implements IEnemy {

    private _physics: Physics;
    private _img: HTMLImageElement;
    private _joint: any;
    private _jointBody: any;
    private _effectGenerator: EffectGenerator;
    
    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        this._physics = Physics.getInstance();

        this.name = name;
        this.textureName = texture;
        this._img = game.Content.loadImage(this.textureName);
        this.body = this._physics.createRectangle(x / this._physics.Scale, y / this._physics.Scale, fw / this._physics.Scale, fh / this._physics.Scale, 'Dynamic', { name: this.name, ref: this }, false, density ? { density: density } : undefined);

        this._jointBody = this._physics.createRectangle((x - 100) / this._physics.Scale, (y + 200) / this._physics.Scale, 5 / this._physics.Scale, 5 / this._physics.Scale, 'static', 'JointBody1', true);
        this._joint = this._physics.createJoint(this.body, this._jointBody, "Prismatic", new Box2D.Common.Math.b2Vec2(1, 0));

        this.entity = new Entity(game,
                                { 'Enemy': { img: this._img, animation: true, anmOption: { ax: 0, ay: 0, frameNum: fnumber, frameW: fw, frameH: fh, frameI: 0, frameSpeed: fps, customize: frames.move } } }
                                , this.body.GetPosition()
                                , this.body.GetAngle()
                                , this.name);
        this.entity.setTexture('Enemy');

        this._effectGenerator = EffectGenerator.getInstance(game);

        super(game);
    }

    private move(gameTime: Core.GameTime): void { }

    Update(gameTime: Core.GameTime) {
        this.entity.update(gameTime, this.body.GetPosition(), this.body.GetAngle());

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        this.entity.draw(this.Game.Services.GetService("CanvasRenderingContext2D"));

        super.Draw(gameTime);
    }

    Dispose(): void {
        if (this.markAsDead) {
            if (this._joint) {
                this._physics.World.DestroyJoint(this._joint);
                this._joint = null;
            }
            if (this._jointBody) {
                this._physics.World.DestroyBody(this._jointBody);
            }
            this._effectGenerator.addEffect({ position: this.body.GetPosition() }, "SmokeWhite", false);
        }
        super.Dispose();
    }
}