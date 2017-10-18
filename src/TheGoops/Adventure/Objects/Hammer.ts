///<reference path="../../Framework/DrawableGameComponent.ts"/>
///<reference path="../../Framework/Input/Mouse.ts"/>
///<reference path="../../Framework/Input/MouseState.ts"/>
///<reference path="../../Interfaces/INail.ts"/>
///<reference path="../Common/AdventurePhysics.ts"/>

class Hammer extends Core.DrawableGameComponent {

    private _nailList: any[];
    private _activate: bool;
    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _physics: AdventurePhysics;
    private _shots: number;
    private _game: Core.Game;
    private _ctx: CanvasRenderingContext2D;
    private _hammerEntity: Entity;

    constructor(game: Core.Game) {
        super(game);

        this._nailList = [];
        this._activate = false;
        this._oldMouseState = Input.Mouse.GetState();
        this._physics = AdventurePhysics.getInstance();
        this._shots = 0;
        this._game = game;
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._hammerEntity = new Entity(game, { "Hammer": { img: game.Content.loadImage("MouseHammer.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 2, frameW: 30, frameH: 27, frameI: 0, frameSpeed: 10, customize: [1] } } }, new Box2D.Common.Math.b2Vec2(Input.Mouse.GetState().X / this._physics.Scale, Input.Mouse.GetState().Y / this._physics.Scale), 0, "Hammer");
        this._hammerEntity.setTexture("Hammer");
    }

    Update(gameTime: Core.GameTime) {
        this._currMouseState = Input.Mouse.GetState();
        if (this._currMouseState.LeftButton && !this._oldMouseState.LeftButton && this._shots > 0) {
            var body = this._physics.getBodyAtMouse(this._currMouseState.X / this._physics.Scale, this._currMouseState.Y / this._physics.Scale);
            if (body) {
                if (body.GetUserData().ref != undefined) {
                    for (var i = 0; i < this._nailList.length; i++) {
                        if (body.GetUserData().ref instanceof this._nailList[i]) {
                            (<INail>body.GetUserData().ref).onHammer();
                            this._shots--;
                            //this._hammerEntity.Animation.setCustomizeFrames([2]);
                        }
                    }
                }
            }
        }

        if (this._hammerEntity) {
            this._hammerEntity.update(gameTime, new Box2D.Common.Math.b2Vec2(this._currMouseState.X / this._physics.Scale, this._currMouseState.Y / this._physics.Scale), 0);
        }

        this._oldMouseState = this._currMouseState;

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        if (this._hammerEntity) {
            this._hammerEntity.draw(this._ctx);
        }

        super.Draw(gameTime);
    }

    public addNail(obj: any) {
        this._nailList.push(obj);
    }

    public Show() {
        this._activate = true;
        this.setEnabled(true);
        this.setVisible(true);
    }

    public Hide() {
        this._activate = false;
        this.setEnabled(false);
        this.setVisible(false);
    }

    public init() {
        this.Hide();
    }

    public get Activate() { return this._activate; }
    public set Activate(value) { this._activate = value; }

    public get Shots() { return this._shots; }
    public set Shots(value) { this._shots = value; }
}