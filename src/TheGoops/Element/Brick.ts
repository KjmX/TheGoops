///<reference path="Mobile.ts"/>
///<reference path="Player.ts"/>
///<reference path="Soldier.ts"/>

class Brick extends Mobile {

    private _health: number;
    private _currentHealth: number;
    private _breakable: bool;
    //private _currContact: any;
    //private _oldContact: any;
    //private _timer: number;

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, circle: bool, health: number, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        super(game, texture, x, y, name, circle, fw, fh, fnumber, fps, frames, density);
        this._health = health;
        this._currentHealth = health;
        this._breakable = true;
        //this._oldContact = null;
        //this._timer = 0;
    }

    /*
    * frame index is calculated from the health and current index of frame array
    */
    Update(gameTime: Core.GameTime) {
        if (!this.markAsDead) {
            this.entity.Animation.setCustomizeFrames(this.frames[Math.floor((this._health - this._currentHealth) / 2)]);
        }
        //this._timer += gameTime.ElapsedGameTime;

        super.Update(gameTime);
    }

    onContact(target: any, impulse: number, method: string): void {
        if (method == 'POST') {
            if (target.ref instanceof Player || target.ref instanceof Soldier) {
                //this._currContact = target.ref;
                console.log(target.name + " -> " + impulse);
                if (this._breakable /*&& this._currContact == this._oldContact && this._timer > 0.1*/) {
                    this._currentHealth--;
                    console.log(this._currentHealth);
                    if (this._currentHealth == 0) {
                        this.markAsDead = true;
                    }
                }
                //this._oldContact = this._currContact;
                //this._timer = 0;
            }
        }
    }

    public get Breakable() { return this._breakable; }
    public set Breakable(value) { this._breakable = value; }

    public get Health() { return this._health; }

    public get CurrentHealth() { return this._currentHealth; }
    public set CurrentHealth(value) { this._currentHealth = value; }
}