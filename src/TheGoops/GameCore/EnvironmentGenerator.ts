///<reference path="../Framework/GameComponent.ts"/>
///<reference path="Score.ts"/>
///<reference path="../Element/Entity.ts"/>
///<reference path="../Common/Physics.ts"/>
///<reference path="../Common/Camera.ts"/>
/*
"lvl-1":[
		{
      "texture": "*********",
	  "name": "********",
	  "anim": "true",//boolean
	  "fnumber": **,
      "fw":**,
      "fh":**,
	  "fps": **,
	  "frames": { "move": [9, 10, 11, 12] },
      "speed": number
    }
	]

*/




class EnvironmentGenerator extends Core.DrawableGameComponent {
    private _environmentArray: any; // an array that contains the objects to be drawn.
    private _levelScore: number;
    private _currentEnvirArray: any;
    private _level: number;
    private _game: Core.Game;
    private _timer: number;
    private _isUpToSpace: bool;
    private _cvs: HTMLCanvasElement;
    private _component: any;
    private _generatedObject: any;
    private _arrayOfObjects: any;
    private _maxObject: number;
    private _position: Box2D.Common.Math.b2Vec2;
    private _camera: Camera;


    constructor(game: Core.Game) {
        super(game);
        this._game = game;
        this._environmentArray = game.Content.loadFile("Environment.json");
        console.log(this._environmentArray);
        if (this._environmentArray != null) {
            this._currentEnvirArray = this._environmentArray["lvl-1"];
        }
        this._levelScore = 30;
        this._level = 2;
        this._timer = 0;
        this._isUpToSpace = false;
        this._cvs = this._game.Services.GetService("HTMLCanvasElement");
        this._component = null;
        this._maxObject = 5;
        this._position = new Box2D.Common.Math.b2Vec2();
        this._arrayOfObjects = [];
        this._camera = Camera.getInstance();
    }

    Update(gameTime: Core.GameTime) {
        this._timer += gameTime.ElapsedGameTime;
        if (this._arrayOfObjects.length < this._maxObject) {
            if (this._timer > 3) {
                if (this._level == 2) {
                    if (this._currentEnvirArray != null && this._currentEnvirArray.length > 0) {
                        var l;
                        if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
                            this._level = 3;
                        }
                    }
                }
                else if (this._level < 50 && this._level > 1) {
                    this._levelScore = 30;
                    if (this._currentEnvirArray != null && this._currentEnvirArray.length > 0) {
                        var l;
                        if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
                            this._level = Math.ceil(l);     // if l = 2.4 then ceil makes it l = 3
                            this._currentEnvirArray.concat(this._environmentArray["lvl-" + this._level]);
                        }
                    }

                }
                else if (this._level > 50) {
                    if (this._isUpToSpace == false) {
                        this._isUpToSpace = true;
                        this._currentEnvirArray = this._environmentArray["lvl-51"];
                    }
                    else {
                        if (this._currentEnvirArray != null && this._currentEnvirArray.length > 0) {
                            var l;
                            if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
                                this._level = Math.ceil(l);     // if l = 2.4 then ceil makes it l = 3
                                this._currentEnvirArray.concat(this._environmentArray["lvl-" + this._level]);
                            }

                        }
                    }

                }
                if (this._currentEnvirArray != null && this._currentEnvirArray.length > 0) {
                    this._generatedObject = Math.floor(Math.random() * this._currentEnvirArray.length);
                    var object = this._currentEnvirArray[this._generatedObject];
                    var direction = (Math.random() > 0.5) ? true : false;
                    //this._position.x = direction ? 0 : this._cvs.width;
                    this._position.x = direction ? 0 : (this._cvs.width) / Physics.getInstance().Scale;

                    var vol = direction ? this._currentEnvirArray[this._generatedObject].speed : -this._currentEnvirArray[this._generatedObject].speed;
                    //this._position.y = Math.random() * this._cvs.width;
                    var r = Math.floor(Math.random() * (this._cvs.height - 160));
                    this._position.y = ((r - this._camera.CanvasOffset.y) / Physics.getInstance().Scale);
                    var objectEntity = new Entity(this._game, {
                        "Generated": {
                            img: this._game.Content.loadImage(this._currentEnvirArray[this._generatedObject].texture),
                            animation: this._currentEnvirArray[this._generatedObject].anim,
                            anmOption: { ax: 0, ay: 0, frameNum: this._currentEnvirArray[this._generatedObject].fn, frameW: this._currentEnvirArray[this._generatedObject].width, frameH: this._currentEnvirArray[this._generatedObject].height, frameI: 0, frameSpeed: this._currentEnvirArray[this._generatedObject].fps, customize: this._currentEnvirArray[this._generatedObject].frames.move }
                        }
                    }, new Box2D.Common.Math.b2Vec2(this._position.x * Physics.getInstance().Scale, this._position.y * Physics.getInstance().Scale ), 0, this._currentEnvirArray[this._generatedObject].name);
                    objectEntity.setTexture("Generated");
                    this._arrayOfObjects.push({ entity: objectEntity, FirstUpdate: true, Speed: vol });
                }
                this._timer = 0;
            }
        }
        if (this._arrayOfObjects.length > 0) {
            for (var i = 0; i < this._arrayOfObjects.length; i++) {
                var pos = new Box2D.Common.Math.b2Vec2(this._arrayOfObjects[i].entity.Position.x, this._arrayOfObjects[i].entity.Position.y);
                if (this._arrayOfObjects[i].FirstUpdate) {
                    pos.x /= Physics.getInstance().Scale;
                    pos.y /= Physics.getInstance().Scale;
                    this._arrayOfObjects[i].FirstUpdate = false;
                }
                pos.x += this._arrayOfObjects[i].Speed / Physics.getInstance().Scale;
                //pos.y -= this._camera.CanvasOffset.y / Physics.getInstance().Scale;
                this._arrayOfObjects[i].entity.update(gameTime, pos, 0);
            }
        }
        if (this._arrayOfObjects.length > 0) {
            for (var i = 0; i < this._arrayOfObjects.length; i++) {
                if ((this._arrayOfObjects[i].Speed > 0 && (this._arrayOfObjects[i].entity.Position.x * Physics.getInstance().Scale) > this._cvs.width + 3)
                    || (this._arrayOfObjects[i].Speed < 0 && (this._arrayOfObjects[i].entity.Position.x * Physics.getInstance().Scale) < 0)) {
                    this._arrayOfObjects.splice(i, 1);
                }
            }
        }

        super.Update(gameTime);

    }
    Draw(gameTime: Core.GameTime) {
        if (this._arrayOfObjects.length > 0) {
            for (var i = 0; i < this._arrayOfObjects.length; ++i) {
                if (this._arrayOfObjects[i] != undefined) {
                    this._arrayOfObjects[i].entity.draw(this._game.Services.GetService("CanvasRenderingContext2D"));
                }
            }
        }
        super.Draw(gameTime);
    }
    private addToComponentList(obj: any) {
        if (this._component == null) {
            return;
        }
        if (this._component instanceof Core.GameComponentArray) {
            (<Core.GameComponentArray>this._component).Add(obj);
        } else {
            this._component.push(obj);
        }
    }

    public init(): void {
        this._arrayOfObjects.length = 0;
        this._level = 2;
        this._timer = 0;
        this._levelScore = 30;
        this._isUpToSpace = false;
        if (this._environmentArray != null) {
            this._currentEnvirArray = this._environmentArray["lvl-1"];
        }
    }

    public get Component() { return this._component; }
    public set Component(value) { this._component = value; }
}