///<reference path="Enemy.ts"/>

class Boss extends Enemy {

    private _danceTime: number;
    private _startPoint: number;
    private _endPoint: number;
    private _reachend: bool;
    private _justCreated: bool;
    private _speed: number;

    constructor(game: Core.Game, texture: string, x: number, y: number, name: string, fw: number, fh: number, fnumber: number, fps: number, frames: any, density?: number) {
        super(game, texture, x, y, name, fw, fh, fnumber, fps, frames, density);

        this._danceTime = 0;
        this._startPoint = 100;
        this._endPoint = 200;
        this._reachend = false;
        this._justCreated = true;
        this._speed = 2;
    }

    private move(gameTime: Core.GameTime) {
        this._danceTime += gameTime.ElapsedGameTime;
        if (this._justCreated) {
            //this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(this._speed, 0), this.body.GetWorldCenter());
            this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(this._speed, 0));
            this._justCreated = false;
        } else {
            if (this._danceTime >= 50) { // he reach x seconds
                //this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(3, 0), this.body.GetWorldCenter());
                this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(5, 0));
            } else {
                if (this.body.GetPosition().x >= (this._endPoint / Physics.getInstance().Scale)) {
                    this._speed = Math.abs(this._speed) * -1;
                    this._reachend = true;
                } else {
                    if (this._reachend && this.body.GetPosition().x <= (this._startPoint / Physics.getInstance().Scale)) {
                        this._speed = Math.abs(this._speed);
                        this._reachend = false;
                    }
                }
                //this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(this._speed, 0), this.body.GetWorldCenter());
                this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(this._speed, 0));
            }
        }
    }

    Update(gameTime: Core.GameTime) {
        this.move(gameTime);

        super.Update(gameTime);
    }

    onContact(target: any, impulse: number, method: string): void {
        if (method == "BEGIN") {
            if ((target.ref instanceof Bullet) || (target.ref instanceof Boss)) {
                this.markAsDead = true;
                (<Cell>target.ref).markAsDead = true;
            }
        }
    }
}