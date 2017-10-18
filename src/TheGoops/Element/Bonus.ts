///<reference path="Mobile.ts"/>

class Bonus extends Mobile {
    //TODO: Add new Bonus to BricksGenerator
    //just long jump and protection for now maybe

    public refrence: any;
    public duration: number;
    private _timer: number;

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, circle: bool, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        super(game, texture, x, y, name, circle, fw, fh, fnumber, fps, frames, density);

        this.refrence = null;
        this._timer = 0;
    }

    Update(gameTime: Core.GameTime) {
        if (this.refrence != null) {
            this._timer += gameTime.ElapsedGameTime;
            if (this._timer >= this.duration) {
                this.Deactivate();
                this.markAsDead = true;
            }
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        super.Draw(gameTime);
    }

    Activate(target: any) { }

    Deactivate() { }

    onContact(target: any, impulse: number, method: string): void {
        if (method == 'POST') {
            console.log("Collided damn");
            this.Activate(target);
        }
    }
}