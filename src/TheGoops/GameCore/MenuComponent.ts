///<reference path="../Framework/DrawableGameComponent.ts"/>
///<reference path="../Framework/Input/Mouse.ts"/>
///<reference path="../Framework/Input/MouseState.ts"/>

enum MenuList {
    START,
    SCORE,
    ABOUT,
    ADVENTURE
}

class MenuComponent extends Core.DrawableGameComponent {

    private _ctx: CanvasRenderingContext2D;
    private _cvs: HTMLCanvasElement;
    private _menuItemsList: any[];
    private _position: { x: number; y: number; };
    private _width: number;
    private _height: number;
    private _selectedItem: MenuList;
    private _spaceBetweenItems: number;
    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _mouseHover: bool;
    private _timer: number;
    private _fadeOut: bool;
    private _ready: bool;
    private _background: Entity;
    private _menuPlanck: Entity;
    private _menuPlanckPos: { x: number; y: number; };
    private _leftX: number;
    private _centerX: number;
    private _drawLeft: bool;
    private _playerAnm: Entity;
    private _cbBlured: Entity;
    private _cbMenu1: Entity;
    private _cbMenu2: Entity;
    private _flyFuzzM: Entity;

    constructor(game: Core.Game) {

        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._cvs = game.Services.GetService("HTMLCanvasElement");
        this._menuItemsList = [];
        this._position = { x: null, y: null };
        this._spaceBetweenItems = 10;
        this._mouseHover = false;
        this._timer = 0;
        this._oldMouseState = Input.Mouse.GetState();
        this._fadeOut = false;
        this._ready = false;

        this._background = new Entity(game, { "MenuBackground": { img: game.Content.loadImage("menuBg.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(12, 8), 0, "MenuBackgroud");
        this._background.setTexture("MenuBackground");

        this._menuPlanckPos = { x: this._cvs.width - 95, y: this._cvs.height / 2 + 50 };
        this._menuPlanck = new Entity(game, { "MenuPlanck": { img: game.Content.loadImage("menuPlanc.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(this._menuPlanckPos.x / Physics.getInstance().Scale, this._menuPlanckPos.y / Physics.getInstance().Scale), 0, "MenuPlanck");
        this._menuPlanck.setTexture("MenuPlanck");

        this._playerAnm = new Entity(game,
                                { "PlayerAnimation": { img: game.Content.loadImage("player.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 30, frameW: 60, frameH: 70, frameI: 0, frameSpeed: 10, customize: [13, 14, 15, 16, 17, 18, 19] } } }
                                , new Box2D.Common.Math.b2Vec2((this._cvs.width / 2 - 20) / Physics.getInstance().Scale, (this._cvs.height / 2 + 50) / Physics.getInstance().Scale)
                                , 0
                                , "PlayerAnimation");
        this._playerAnm.setTexture("PlayerAnimation");

        this._flyFuzzM = new Entity(game,
                                { "FlyFuzzM": { img: game.Content.loadImage("flyFuzzM.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 6, frameW: 50, frameH: 40, frameI: 0, frameSpeed: 10 } } }
                                , new Box2D.Common.Math.b2Vec2((this._menuPlanckPos.x + 2) / Physics.getInstance().Scale, (this._menuPlanckPos.y - this._menuPlanck.Height / 2 - 13) / Physics.getInstance().Scale)
                                , 0
                                , "FlyFuzzM");
        this._flyFuzzM.setTexture("FlyFuzzM");

        this._cbMenu1 = new Entity(game,
                                { "CbMenu1Animation": { img: game.Content.loadImage("cbMenu1.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 4, frameW: 53, frameH: 60, frameI: 0, frameSpeed: 10 } } }
                                , new Box2D.Common.Math.b2Vec2((100) / Physics.getInstance().Scale, (this._cvs.height - 70) / Physics.getInstance().Scale)
                                , 0
                                , "CbMenu1Animation");
        this._cbMenu1.setTexture("CbMenu1Animation");

        this._cbMenu2 = new Entity(game,
                                { "CbMenu2Animation": { img: game.Content.loadImage("cbMenu2.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 4, frameW: 66.25, frameH: 75, frameI: 0, frameSpeed: 10 } } }
                                , new Box2D.Common.Math.b2Vec2((170) / Physics.getInstance().Scale, (this._cvs.height - 50) / Physics.getInstance().Scale)
                                , 0
                                , "CbMenu2Animation");
        this._cbMenu2.setTexture("CbMenu2Animation");

        this._cbBlured = new Entity(game,
                                { "CbBluredAnimation": { img: game.Content.loadImage("cbBlured.png"), animation: true, anmOption: { ax: 0, ay: 0, frameNum: 4, frameW: 287, frameH: 324, frameI: 0, frameSpeed: 10 } } }
                                , new Box2D.Common.Math.b2Vec2((5) / Physics.getInstance().Scale, (this._cvs.height - 15) / Physics.getInstance().Scale)
                                , 0
                                , "CbBluredAnimation");
        this._cbBlured.setTexture("CbBluredAnimation");

        this._menuItemsList[MenuList.START] = { normal: game.Content.loadImage("start.png"), hover: game.Content.loadImage("start.png"), position: null };
        this._menuItemsList[MenuList.SCORE] = { normal: game.Content.loadImage("score.png"), hover: game.Content.loadImage("score.png"), position: null };
        this._menuItemsList[MenuList.ABOUT] = { normal: game.Content.loadImage("about.png"), hover: game.Content.loadImage("about.png"), position: null };
        this._menuItemsList[MenuList.ADVENTURE] = { normal: game.Content.loadImage("start.png"), hover: game.Content.loadImage("start.png"), position: null };

        // be sure that this method is at the bottom of the constructor
        this.CalculateBounds();

        this._position = { x: this._menuPlanckPos.x - (this._width / 2) - (this._menuPlanck.Width / 2) + 15, y: this._menuPlanckPos.y - (this._menuPlanck.Height / 2) + 27 };

        this._leftX = this._position.x - (this._width / 2) + (this._menuPlanck.Width - 10);
        this._centerX = this._position.x;
        this._drawLeft = true;

        super(game);
    }

    private CalculateBounds() {
        this._width = 0;
        this._height = 0;
        for (var item in this._menuItemsList) {
            if (this._menuItemsList[item].normal.width > this._width) {
                this._width = this._menuItemsList[item].normal.width;
            }
            this._height += this._menuItemsList[item].normal.width + this._spaceBetweenItems;
        }
    }

    Update(gameTime: Core.GameTime) {
        this._currMouseState = Input.Mouse.GetState();
        this._selectedItem = -1;
        for (var i = 0; i < this._menuItemsList.length; ++i) {
            if (this._menuItemsList[i].position != null) {
                if (this._currMouseState.X > this._menuItemsList[i].position.x && this._currMouseState.X < this._menuItemsList[i].position.x + this._menuItemsList[i].normal.width
                    && this._currMouseState.Y > this._menuItemsList[i].position.y && this._currMouseState.Y < this._menuItemsList[i].position.y + this._menuItemsList[i].normal.height) {
                    this._selectedItem = i;
                    if (!this._currMouseState.LeftButton && this._oldMouseState.LeftButton) {
                        this._fadeOut = true;
                    }
                }
            }
        }
        this._oldMouseState = this._currMouseState;

        this._playerAnm.update(gameTime, this._playerAnm.Position, this._playerAnm.Angle);

        this._flyFuzzM.update(gameTime, this._flyFuzzM.Position, this._flyFuzzM.Angle);

        this._cbMenu1.update(gameTime, this._cbMenu1.Position, this._cbMenu1.Angle);

        this._cbMenu2.update(gameTime, this._cbMenu2.Position, this._cbMenu2.Angle);

        this._cbBlured.update(gameTime, this._cbBlured.Position, this._cbBlured.Angle);

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        /*if (this._fadeOut) {
            this.fadeOut(gameTime);
        }*/

        this._background.draw(this._ctx);

        this._menuPlanck.draw(this._ctx);

        this._playerAnm.draw(this._ctx);

        this._flyFuzzM.draw(this._ctx);

        this._cbMenu1.draw(this._ctx);

        this._cbMenu2.draw(this._ctx);

        this._cbBlured.draw(this._ctx);

        var x;
        var y = this._position.y;
        var texture;
        for (var i = 0; i < this._menuItemsList.length; ++i) {
            if (i == this._selectedItem) {
                texture = this._menuItemsList[i].hover;
            } else {
                texture = this._menuItemsList[i].normal;
            }
            if (this._menuItemsList[i].position == null) {
                x = this._drawLeft ? this._leftX : this._centerX;
                this._drawLeft = !this._drawLeft;
                this._menuItemsList[i].position = { x: x, y: y };
            }
            this._ctx.drawImage(texture, this._menuItemsList[i].position.x, this._menuItemsList[i].position.y);
            
            y += this._spaceBetweenItems + this._menuItemsList[i].normal.height;
        }

        super.Draw(gameTime);
    }

    private fadeOut(gameTime: Core.GameTime) {
        this._ctx.save();
        this._ctx.fillStyle = "rgba(0,0,0, 0.2)";
        this._ctx.fillRect(0, 0, this._cvs.width, this._cvs.height);
        this._ctx.restore();
        this._timer += gameTime.ElapsedGameTime;
        if (this._timer > 2) {
            this._fadeOut = false;
            this._ready = true;
        }
    }

    public get Position() { return this._position; }
    public set Position(value) { this._position = value; }

    public get Width() { return this._width; }
    public get height() { return this._height; }
    public get SelectedItem() { return this._selectedItem; }
    public get Ready() { return this._ready; }
}