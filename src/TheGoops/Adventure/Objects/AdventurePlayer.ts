///<reference path="../../Framework/DrawableGameComponent.ts"/>
///<reference path="../Common/AdventurePhysics.ts"/>

class AdventurePlayer extends Core.DrawableGameComponent {

    private _physics: AdventurePhysics;
    private _x: number;
    private _y: number;
    private _points: number;
    private _body: Box2D.Dynamics.b2Body;
    private _score: number;
    private _ctx: CanvasRenderingContext2D;
    private _entity: Entity;
    private _game: Core.Game;
    private _dispose: bool;

    constructor(game: Core.Game, x: number, y: number) {
        super(game);

        this._physics = AdventurePhysics.getInstance();
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._x = x;
        this._y = y;
        this._score = 0;
        this._game = game;
        this._dispose = false;

        this.myPlayer();
    }

    private myPlayer() {
        this._body = this._physics.createCircle(this._x / this._physics.Scale, this._y / this._physics.Scale, (70 / 2) / this._physics.Scale, 'dynamic', { name: "AdventurePlayer", ref: this }, true, { density: 0.1});

        this._entity = new Entity(this._game,
                                { 'Player': { img: this._game.Content.loadImage("player.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 30, frameW: 60, frameH: 70, frameI: 0, frameSpeed: 10, customize: [3, 4, 5, 6, 7, 8, 9] } } }
                                , this._body.GetPosition()
                                , this._body.GetAngle()
                                , 'Player');
        this._entity.setTexture("Player");
    }

    Update(gameTime: Core.GameTime) {

        this._entity.update(gameTime, this._body.GetPosition(), this._body.GetAngle());

        /*if (this._dispose) {
            this._physics.World.DestroyBody
        }*/

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

        this._entity.draw(this._ctx);

        this._ctx.fillText(this._score.toString(), 10, 50);

        super.Draw(gameTime);
    }

    onContact(target: any, impulse: number, method: string): void {
        if (target.ref != undefined && target.ref instanceof Star) {
            this._score += (<Star>target.ref).Points;
        }
    }

    public Dispose() {
        this._physics.World.DestroyBody(this._body);
        this._entity = null;
    }

    public get Score() { return this._score; }
    public get Body() { return this._body; }
}