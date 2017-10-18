///<reference path="Inactive.ts"/>

class Static extends Inactive {
    private _physics: Physics;
    private _img: HTMLImageElement;

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, fw: number, fh: number, density?: number) {
        this._physics = Physics.getInstance();
        this.name = name;
        this.body = this._physics.createRectangle(x / this._physics.Scale, y / this._physics.Scale, fw / this._physics.Scale, fh / this._physics.Scale, 'static', { name: this.name, ref: this }, true, density ? { density: density } : undefined);
        this.textureName = texture;
        if (this.textureName != "") {
            this._img = game.Content.loadImage(this.textureName);
            this.entity = new Entity(game,
                                    { 'StaticElement': { img: this._img, animation: false } }
                                    , this.body.GetPosition()
                                    , this.body.GetAngle()
                                    , this.name);
            this.entity.setTexture('StaticElement');
        }

        super(game);
    }
    Update(gameTime: Core.GameTime) {
        if (this.textureName != "") this.entity.update(gameTime, this.body.GetPosition(), this.body.GetAngle());

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        if (this.textureName != "") this.entity.draw(this.Game.Services.GetService("CanvasRenderingContext2D"));

        super.Draw(gameTime);
    }
}