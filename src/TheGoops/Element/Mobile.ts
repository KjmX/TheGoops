///<reference path="Inactive.ts"/>

class Mobile extends Inactive {

    private _physics: Physics;
    private _img: HTMLImageElement;

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, circle: bool, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        this._physics = Physics.getInstance();
        
        this.name = name;
        this.textureName = texture;
        this.frames = frames;
        this._img = game.Content.loadImage(texture);
        if (circle) {
            var radius = fw / 2 / this._physics.Scale;
            this.body = this._physics.createCircle(x / this._physics.Scale, y / this._physics.Scale, radius, 'dynamic', { name: this.name, ref: this }, false, density ? { density: density } : undefined);
        } else {
            this.body = this._physics.createRectangle(x / this._physics.Scale, y / this._physics.Scale, fw / this._physics.Scale, fh / this._physics.Scale, 'dynamic', { name: this.name, ref: this }, false, density ? { density: density } : undefined);
        }
        this.entity = new Entity(game,
                                { 'Mobile': { img: this._img, animation: true, anmOption: { ax: 0, ay: 0, frameNum: fnumber, frameW: fw, frameH: fh, frameI: 0, frameSpeed: fps, customize: frames[0] } } }
                                , this.body.GetPosition()
                                , this.body.GetAngle()
                                , this.name);
        this.entity.setTexture('Mobile');

        super(game);
    }

    Update(gameTime: Core.GameTime) {
        if (this.entity) {
            this.entity.update(gameTime, this.body.GetPosition(), this.body.GetAngle());
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        if (this.entity) {
            this.entity.draw(this.Game.Services.GetService("CanvasRenderingContext2D"));
        }

        super.Draw(gameTime);
    }
}