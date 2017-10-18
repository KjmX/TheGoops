///<reference path="../Framework/GameComponent.ts"/>
///<reference path="Score.ts"/>
///<reference path="../Element/Entity.ts"/>
///<reference path="../Common/Camera.ts"/>
///<reference path="EventAggregator.ts"/>
///<reference path="Events/CameraMove.ts"/>

class BackgroundGenerator extends Core.GameComponent {
    private _game: Core.Game;
    private _backgroundsArray: any;
    private _entityArray: any;
    private _currentTexture: string;
    private _nextTexture: string;
    private _currentBg: any;
    private _nextBg: any;
    private _score: Score;
    private _level: number;
    private _levelScore: number;
    private _bgHeigh: number;
    private _position: Box2D.Common.Math.b2Vec2;
    private _nextPosition: Box2D.Common.Math.b2Vec2;
    private _camera: Camera;
    private _isUpToSky: bool;
    private _isUpToSpace: bool;
    private _isPinkToBlue: bool;
    private _isBlueToDarkBlue: bool;
    private _isDarkBlueToDarkerBlue: bool;
    private _isDarkerBlueToSpaceBlue: bool;
    private _checkerP: number;
    private _checkerC: number;
    private _upNum: number;
    private _bgHeighCounter: number;

    constructor(game: Core.Game) {
        super(game);
        this._game = game;
        this._score = game.Services.GetService("Score");
        this._camera = Camera.getInstance();

        this._bgHeigh = 16; // 480px / 30
        this._entityArray = [];

        this._backgroundsArray = game.Content.loadFile("backgrounds.json");
        if (this._backgroundsArray == undefined) this._backgroundsArray = [];

        this.initialize(game);


    }


    private initialize(game) {
        this._checkerC = 0;
        this._checkerP = 0;
        this._upNum = 0;
        this._level = 1;
        this._bgHeighCounter = 1;
        this._position = new Box2D.Common.Math.b2Vec2(12, 8);
        this._nextPosition = new Box2D.Common.Math.b2Vec2(this._position.x, this._position.y);
        this._isUpToSky = false;
        this._isUpToSpace = false;
        this._isPinkToBlue = false;
        this._isBlueToDarkBlue = false;
        this._isDarkBlueToDarkerBlue = false;
        this._isDarkerBlueToSpaceBlue = false;

        //this._entityArray = [];
        //lvl 1 textures (°/_\°)
        this._currentTexture = this._backgroundsArray ? this._backgroundsArray[0].texture : "";
        this._nextTexture = this._backgroundsArray ? this._backgroundsArray[1].texture : "";

        //1st & 2nd bg
        this._currentBg = new Entity(game, { "Bg-1": { img: game.Content.loadImage(this._currentTexture), animation: false } }, this._position, 0, "Bg-1");
        this._currentBg.setTexture("Bg-1");
        this._entityArray.push(this._currentBg);

        this._nextPosition.y -= this._bgHeigh * this._bgHeighCounter;
        this._nextBg = new Entity(game, { "Bg-2": { img: game.Content.loadImage(this._nextTexture), animation: false } }, this._nextPosition, 0, "Bg-2");
        this._nextBg.setTexture("Bg-2");
        this._entityArray.push(this._nextBg);

        this._level++;

        EventAggregator.getInstance().Subscribe(this, CameraMove);
    }


    Update(gameTime: Core.GameTime) {
        if (this._checkerC > 79) { //should change when changing camera up speed
            this._checkerC = 0;    //in our case : camera up with cvs/3(=160) by 2 each time
            this._upNum++;         //so 480/3/2 = 80 notification from the CameraMove Event
        }


        if (this._upNum == 3) {//if camera up 3 times
            this._upNum = 0;

            this._currentBg = this._nextBg;
            this._entityArray.splice(0, 2);
            this._entityArray.push(this._currentBg);

            if (this._level < 50 && this._level > 1) {//sky lvl-----(T/_\°)---------
                if (this._isUpToSky == false) {
                    this._isUpToSky = true;
                    this._levelScore = 100;
                }

                var l;
                if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
                    this._level = Math.ceil(l);
                }

                if (this._level < 3) {
                    this._nextTexture = this._backgroundsArray ? this._backgroundsArray[2].texture : "";
                    var pos = new Box2D.Common.Math.b2Vec2(this._nextPosition.x, this._nextPosition.y - (this._bgHeigh * this._bgHeighCounter));
                    this._bgHeighCounter++;
                    this._nextBg = new Entity(this._game, { "Bg-3": { img: this._game.Content.loadImage(this._nextTexture), animation: false } }, pos, 0, "Bg-3");
                    this._nextBg.setTexture("Bg-3");
                    this._entityArray.push(this._nextBg);
                }

                if (this._level >= 3) {
                    if (this._isPinkToBlue) {
                        this._nextTexture = this._backgroundsArray ? this._backgroundsArray[4].texture : "";
                        var pos = new Box2D.Common.Math.b2Vec2(this._nextPosition.x, this._nextPosition.y - (this._bgHeigh * this._bgHeighCounter));
                        this._bgHeighCounter++;
                        this._nextBg = new Entity(this._game, { "Bg-5": { img: this._game.Content.loadImage(this._nextTexture), animation: false } }, pos, 0, "Bg-5");
                        this._nextBg.setTexture("Bg-5");
                        this._entityArray.push(this._nextBg);
                    }
                    //1st time here this will be executed :
                    if (!this._isPinkToBlue) {
                        this._nextTexture = this._backgroundsArray ? this._backgroundsArray[3].texture : "";
                        var pos = new Box2D.Common.Math.b2Vec2(this._nextPosition.x, this._nextPosition.y - (this._bgHeigh * this._bgHeighCounter));
                        this._bgHeighCounter++;
                        this._nextBg = new Entity(this._game, { "Bg-4": { img: this._game.Content.loadImage(this._nextTexture), animation: false } }, pos, 0, "Bg-4");
                        this._nextBg.setTexture("Bg-4");
                        this._entityArray.push(this._nextBg);
                        this._isPinkToBlue = true;
                    }
                }

            }//sky end

            //space at arround 5000 meters
            if (this._level >= 50) {//space lvl--------(T/_\T)-------
                if (this._isUpToSpace == false) {
                    this._isUpToSpace = true;
                    //this._levelScore = 200;
                }

                // i dunno if this works (-_-), reach space to find out.
                if (this._isBlueToDarkBlue && this._isDarkBlueToDarkerBlue && this._isDarkerBlueToSpaceBlue) {
                    this._nextTexture = this._backgroundsArray ? this._backgroundsArray[8].texture : "";
                    var pos = new Box2D.Common.Math.b2Vec2(this._nextPosition.x, this._nextPosition.y - (this._bgHeigh * this._bgHeighCounter));
                    this._bgHeighCounter++;
                    this._nextBg = new Entity(this._game, { "Bg-9": { img: this._game.Content.loadImage(this._nextTexture), animation: false } }, pos, 0, "Bg-9");
                    this._nextBg.setTexture("Bg-9");
                    this._entityArray.push(this._nextBg);
                    this._isDarkerBlueToSpaceBlue = true;
                }
                if (this._isBlueToDarkBlue && this._isDarkBlueToDarkerBlue && !this._isDarkerBlueToSpaceBlue) {
                    this._nextTexture = this._backgroundsArray ? this._backgroundsArray[7].texture : "";
                    var pos = new Box2D.Common.Math.b2Vec2(this._nextPosition.x, this._nextPosition.y - (this._bgHeigh * this._bgHeighCounter));
                    this._bgHeighCounter++;
                    this._nextBg = new Entity(this._game, { "Bg-8": { img: this._game.Content.loadImage(this._nextTexture), animation: false } }, pos, 0, "Bg-8");
                    this._nextBg.setTexture("Bg-8");
                    this._entityArray.push(this._nextBg);
                    this._isDarkerBlueToSpaceBlue = true;
                }
                if (this._isBlueToDarkBlue && !this._isDarkBlueToDarkerBlue) {
                    this._nextTexture = this._backgroundsArray ? this._backgroundsArray[6].texture : "";
                    var pos = new Box2D.Common.Math.b2Vec2(this._nextPosition.x, this._nextPosition.y - (this._bgHeigh * this._bgHeighCounter));
                    this._bgHeighCounter++;
                    this._nextBg = new Entity(this._game, { "Bg-7": { img: this._game.Content.loadImage(this._nextTexture), animation: false } }, pos, 0, "Bg-7");
                    this._nextBg.setTexture("Bg-7");
                    this._entityArray.push(this._nextBg);
                    this._isDarkBlueToDarkerBlue = true;
                }
                if (!this._isBlueToDarkBlue) {
                    this._nextTexture = this._backgroundsArray ? this._backgroundsArray[5].texture : "";
                    var pos = new Box2D.Common.Math.b2Vec2(this._nextPosition.x, this._nextPosition.y - (this._bgHeigh * this._bgHeighCounter));
                    this._bgHeighCounter++;
                    this._nextBg = new Entity(this._game, { "Bg-6": { img: this._game.Content.loadImage(this._nextTexture), animation: false } }, pos, 0, "Bg-6");
                    this._nextBg.setTexture("Bg-6");
                    this._entityArray.push(this._nextBg);
                    this._isBlueToDarkBlue = true;
                }

                var l;
                if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
                    this._level = Math.ceil(l);
                }
            }//space end

        }
        super.Update(gameTime);
    }


    EventNotify(sub: any, message?: any): void {
        if (sub instanceof CameraMove) {
            this._checkerC++;
        }
    }


    public init(): void {
        //this._levelScore = 100;
        this._entityArray.splice(0, 2);
        this.initialize(this._game);
    }


    public get EntityArray() { return this._entityArray; }
}