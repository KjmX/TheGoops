///<reference path="../../Element/Brick.ts"/>
///<reference path="../../Interfaces/INail.ts"/>

class AdventureBrick extends Brick implements INail {

    private _physics: AdventurePhysics;
    private _health: number;

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, circle: bool, health: number, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        super(game, texture, x, y, name, circle, health, fw, fh, fnumber, fps, frames, density);
        this._physics = AdventurePhysics.getInstance();
        Physics.getInstance().World.DestroyBody(this.body);
        this.body = this._physics.createRectangle(x / this._physics.Scale, y / this._physics.Scale, fw / this._physics.Scale, fh / this._physics.Scale, 'dynamic', { name: this.name, ref: this }, false, density ? { density: density } : undefined);
    }

    Update(gameTime: Core.GameTime) {
        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        super.Draw(gameTime);
    }

    onContact(target: any, impulse: number, method: string): void {
        console.log("contact");
    }

    onHammer(): void {
        console.log("Hammered");
        this.CurrentHealth -= 2;
        if (this.CurrentHealth == 0) {
            this.markAsDead = true;
            console.log("Dead");
        }
    }

    public Dispose() {
        this.markAsDead = true;
        super.Dispose();
    }
}