///<reference path="../Bonus.ts"/>
///<reference path="../Brick.ts"/>

class BrickProtectionBonus extends Bonus {

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, circle: bool, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        super(game, texture, x, y, name, circle, fw, fh, fnumber, fps, frames, density);

        this.duration = 10;
    }

    Activate(target: any) {
        if (target.ref instanceof Brick) {
            this.refrence = target.ref;
            (<Brick>target.ref).Breakable = false;
            this.markAsInvisible = true;
        }

        super.Activate(target);
    }

    Deactivate() {
        if (this.refrence) {
            (<Brick>this.refrence).Breakable = true;
        }

        super.Deactivate();
    }
}