///<reference path="../GameCore/GameScene.ts"/>
///<reference path="../Element/Entity.ts"/>

class PackLevels extends GameScene implements IListener {

    private _pack: any;
    private _levelsArray: any[];
    private _entityArray: Entity[];
    private _cvs: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _physics: Physics;
    private _game: Core.Game;

    private _totalWidth: number;
    private _totalHeight: number;
    private _frameWidth: number;
    private _frameHeight: number;
    private _lvlNum: number;
    private _spacing: number;
    private _lvlPerLine: number;
    private _defaultCenter: Box2D.Common.Math.b2Vec2;

    private _unlockedIMG: HTMLImageElement;
    private _lockedIMG: HTMLImageElement;
    private _highlightIMG: HTMLImageElement;

    private _background: Entity;
    private _frontground: Entity;
    private _highlightList: Entity[];
    private _numbersList: Entity[];
    private _backBtn: Button;

    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _selectedLevel;
    private _back: bool;

    private _unlockedLevelsList: bool[];

    constructor(game: Core.Game) {
        super(game);

        this._game = game;
        this._cvs = game.Services.GetService("HTMLCanvasElement");
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._physics = Physics.getInstance();

        this._levelsArray = [];
        this._entityArray = [];
        this._highlightList = [];
        this._numbersList = [];

        this._oldMouseState = Input.Mouse.GetState();

        this._unlockedIMG = game.Content.loadImage("lvls.png");
        this._lockedIMG = game.Content.loadImage("lvlsLocked.png");
        this._highlightIMG = game.Content.loadImage("lvlsHighlight.png");

        this._background = new Entity(game, { "LvlMenuBackGround": { img: game.Content.loadImage("bannerBack.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(12, 8), 0, "LvlMenuBackground");
        this._background.setTexture("LvlMenuBackGround");
        this._frontground = new Entity(game, { "LvlMenuFrontGround": { img: game.Content.loadImage("bannerFront.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(12, 8), 0, "LvlMenuFrontGround");
        this._frontground.setTexture("LvlMenuFrontGround");
        
        this._lvlNum = 10;
        this._spacing = 20;
        this._lvlPerLine = 5;

        this._frameWidth = this._unlockedIMG.width;
        this._frameHeight = this._unlockedIMG.height;

        this._totalWidth = (this._lvlPerLine * this._frameWidth) + (this._lvlPerLine - 1) * this._spacing;
        this._totalHeight = ((this._lvlNum / this._lvlPerLine) * this._frameHeight) + ((this._lvlNum / this._lvlPerLine) - 1) * this._spacing;

        this._defaultCenter = new Box2D.Common.Math.b2Vec2((this._cvs.width / 2) - (this._totalWidth / 2) + (this._frameWidth / 2), (this._cvs.height / 2) - (this._totalHeight / 2) + (this._frameHeight / 2));

        this._unlockedLevelsList = [];
        this._unlockedLevelsList[0] = true;

        this._back = false;

        EventAggregator.getInstance().Subscribe(this, ButtonAction);

        this._backBtn = new Button(game.Content.loadImage("arrowBackSheet1.png"), this._cvs.width - 50, 50, 100, 50);
    }

    Update(gameTime: Core.GameTime) {
        this._currMouseState = Input.Mouse.GetState();
        this._selectedLevel = null;
        for (var i = 0; i < this._levelsArray.length; ++i) {
            if (this._entityArray[i].Position != null && this._unlockedLevelsList[i]) {
                if ((this._currMouseState.X > (this._entityArray[i].Position.x * this._physics.Scale) - this._frameWidth / 2) && (this._currMouseState.X < ((this._entityArray[i].Position.x * this._physics.Scale) - this._frameWidth / 2) + this._frameWidth)
                    && (this._currMouseState.Y > (this._entityArray[i].Position.y * this._physics.Scale) - this._frameHeight / 2) && (this._currMouseState.Y < ((this._entityArray[i].Position.y * this._physics.Scale) - this._frameHeight / 2) + this._frameHeight)) {
                    this._selectedLevel = this._levelsArray[i].name;
                }
            }
        }
        this._oldMouseState = this._currMouseState;

        this._backBtn.Update(gameTime);

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

        this._background.draw(this._ctx);

        for (var i = 0; i < this._levelsArray.length; ++i) {
            this._highlightList[i].draw(this._ctx);
            this._entityArray[i].draw(this._ctx);
            if (this._unlockedLevelsList[i]) {
                this._numbersList[i].draw(this._ctx);
            }
        }

        this._frontground.draw(this._ctx);

        this._backBtn.Draw(this._ctx, gameTime);

        //this._ctx.fillText(this._selectedLevel, 10, 50);
        super.Draw(gameTime);
    }

    public setPack(value) {
        this._pack = value;
        this._levelsArray = this._game.Content.loadFile("packLevels.json")["pck-" + this._pack.id];
        for (var i = 0; i < this._levelsArray.length; ++i) {
            var position = this.calcPosition(i);
            var lvlImg = this._unlockedLevelsList[i] ? this._unlockedIMG : this._lockedIMG;
            this._entityArray[i] = new Entity(this._game
                                          , { "Level": { img: lvlImg, animation: false } }
                                          , position
                                          , 0
                                          , this._levelsArray[i].name);
            this._entityArray[i].setTexture("Level");
            this._highlightList[i] = new Entity(this._game
                                          , { "LevelHighlight": { img: this._highlightIMG, animation: false } }
                                          , position
                                          , 0
                                          , "LevelHighlight");
            this._highlightList[i].setTexture("LevelHighlight");
            this._numbersList[i] = new Entity(this._game
                                          , { "LevelNumber": { img: this._game.Content.loadImage((i+1)+".png"), animation: false } }
                                          , position
                                          , 0
                                          , "LevelNumber");
            this._numbersList[i].setTexture("LevelNumber");
        }
    }

    private calcPosition(index: number): Box2D.Common.Math.b2Vec2 {
        var x = (this._frameWidth * index) + (this._spacing * index) + this._defaultCenter.x;
        var y = this._defaultCenter.y;
        if ((index + 1) > this._lvlPerLine) {
            var xIndex = (index) % this._lvlPerLine;
            x = (this._frameWidth * xIndex) + (this._spacing * xIndex) + this._defaultCenter.x;
            var yIndex = Math.floor(Math.max(0, index / this._lvlPerLine));
            y += (this._frameHeight * yIndex) + (this._spacing * yIndex);
        }

        return new Box2D.Common.Math.b2Vec2(x / this._physics.Scale, y / this._physics.Scale);
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof ButtonAction) {
            if ((<ButtonAction>sub).button == this._backBtn) {
                this._back = true;
            }
        }
    }

    public get SelectedLevel() { return this._selectedLevel; }
    public get Pack() { return this._pack; }
    public get Back() { return this._back; }
    public set Back(value) { this._back = value; }
}