///<reference path="../GameCore/GameScene.ts"/>
///<reference path="../Element/Entity.ts"/>
///<reference path="Common/AdventurePhysics.ts"/>

class AdventureScene extends GameScene implements IListener {

    private _packArray: any[];
    private _entityArray: Entity[];
    private _cvs: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _physics: AdventurePhysics;
    private _selectedPack: any;
    private _world: Box2D.Dynamics.b2World;
    private _hover: bool;
    private _background: Entity;
    private _titleEntity: Entity[];
    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _back: bool;
    private _backBtn: Button;

    constructor(game: Core.Game) {
        super(game);

        this._cvs = game.Services.GetService("HTMLCanvasElement");
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._physics = AdventurePhysics.getInstance();
        this._physics.createWorld(new Box2D.Common.Math.b2Vec2(0, 10), true);
        this._world = this._physics.World;
        this._oldMouseState = Input.Mouse.GetState();

        this._packArray = game.Content.loadFile("packs.json");
        this._entityArray = [];
        if (this._packArray == undefined) {
            this._packArray = [];
        }

        this._titleEntity = [];

        for (var i = 0; i < this._packArray.length; ++i) {
            this._entityArray[i] = new Entity(game
                                          , { "Pack": { img: game.Content.loadImage(this._packArray[i].texture), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 2, frameW: this._packArray[i].width, frameH: this._packArray[i].height, frameI: 0, frameSpeed: 10, customize: [1] } } }
                                          , new Box2D.Common.Math.b2Vec2(this._cvs.width / 2 / this._physics.Scale, this._cvs.height / 2 / this._physics.Scale)
                                          , 0
                                          , this._packArray[i].name);
            this._entityArray[i].setTexture("Pack");

            this._titleEntity[i] = new Entity(game, { "PackTitle": { img: game.Content.loadImage(this._packArray[i].title), animation: false } }, new Box2D.Common.Math.b2Vec2(this._cvs.width / 2 / this._physics.Scale, (this._cvs.height / 2 - 160) / this._physics.Scale), 0, "PackTitle");
            this._titleEntity[i].setTexture("PackTitle");
        }
        this._selectedPack = this._packArray[0];

        this._background = new Entity(game, { "LvlPackBackGround": { img: game.Content.loadImage("backPack1.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(12, 8), 0, "LvlPackBackGround");
        this._background.setTexture("LvlPackBackGround");


        EventAggregator.getInstance().Subscribe(this, ButtonAction);

        this._backBtn = new Button(game.Content.loadImage("arrowBackSheet1.png"), this._cvs.width - 50, 50, 100, 50);

        this._hover = false;
    }

    Update(gameTime: Core.GameTime) {
        this._currMouseState = Input.Mouse.GetState();
        this._hover = false;
        this._selectedPack = null;
        for (var i = 0; i < this._packArray.length; ++i) {
            this._entityArray[i].Animation.setCustomizeFrames([1]);
            var xStart = this._entityArray[i].Position.x * this._physics.Scale - this._entityArray[i].Width / 2;
            var xEnd = this._entityArray[i].Position.x * this._physics.Scale + this._entityArray[i].Width / 2;
            var yStart = this._entityArray[i].Position.y * this._physics.Scale - this._entityArray[i].Height / 2;
            var yEnd = this._entityArray[i].Position.y * this._physics.Scale + this._entityArray[i].Height / 2;

            if (this._currMouseState.X > xStart && this._currMouseState.X < xEnd
                    && this._currMouseState.Y > yStart && this._currMouseState.Y < yEnd) {
                this._hover = true;
                this._selectedPack = this._packArray[i];
                this._entityArray[i].Animation.setCustomizeFrames([2]);
            }

            this._entityArray[i].update(gameTime, this._entityArray[i].Position, this._entityArray[i].Angle);
        }

        this._backBtn.Update(gameTime);

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        this._background.draw(this._ctx);

        for (var i = 0; i < this._packArray.length; ++i) {
            this._entityArray[i].draw(this._ctx);
            this._titleEntity[i].draw(this._ctx);
        }

        this._backBtn.Draw(this._ctx, gameTime);

        super.Draw(gameTime);
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof ButtonAction) {
            if ((<ButtonAction>sub).button == this._backBtn) {
                this._back = true;
            }
        }
    }

    public get SelectedPack() { return this._selectedPack; }
    public get Back() { return this._back; }
    public set Back(value) { this._back = value; }
}