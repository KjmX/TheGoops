///<reference path="../Bonus.ts"/>
///<reference path="../Player.ts"/>

class JumpBonus extends Bonus {

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, circle: bool, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        super(game, texture, x, y, name, circle, fw, fh, fnumber, fps, frames, density);

        this.duration = 10;
    }

    Activate(target: any) {
        if (target.ref instanceof Player) {
            this.refrence = target.ref;
            (<Player>target.ref).JumpVelocity = 100;
            (<Player>target.ref).HasBonus = true;
            (<Player>target.ref).ScoreUp = false;
            (<Player>target.ref).AirFrames = [21];
            (<Player>target.ref).ContactFrames = [22, 23, 24, 25, 26, 27, 28, 29, 30];
            this.markAsInvisible = true;
        }

        super.Activate(target);
    }

    Deactivate() {
        if (this.refrence) {
            (<Player>this.refrence).DefaultValues();
        }

        super.Deactivate();
    }
}