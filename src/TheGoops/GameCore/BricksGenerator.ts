///<reference path="../Framework/DrawableGameComponent.ts"/>
///<reference path="Score.ts"/>
///<reference path="../Element/Entity.ts"/>
///<reference path="../Element/Bonus.ts"/>
///<reference path="../Framework/Input/Mouse.ts"/>
///<reference path="../Framework/Input/MouseState.ts"/>
///<reference path="../Element/Bonuses/JumpBonus.ts"/>
///<reference path="../Element/Bonuses/BrickProtectionBonus.ts"/>
///<reference path="../Common/Camera.ts"/>

/*
*    objects.json structure
*    {
*      "lvl-1": [
*        "obj1",
*        "obj2"
*      ],
*      "lvl-2": [
*        "obj1",
*        "obj2"
*      ]
*    }
*/

class BricksGenerator extends Core.DrawableGameComponent {

    private _objArray: any;     // contain all objects of all levels
    private _bonusArray: any;
    private _currObjArray: any; // contain only current and previous levels objects
    private _levelScore: number;    // recommended score to pass to next level
    private _generatedBonus: number;
    private _generatedObj: number;
    private _level: number;
    private _bonusIndex: number;
    private _game: Core.Game;
    private _entityList: { info: any; entity: Entity; }[];
    private _timer: number;
    private _speed: number;
    private _limit: number;
    private _entityIndex: number;
    private _initialPosition: Box2D.Common.Math.b2Vec2;
    private _mouseState: Input.MouseState;
    private _circleData: Box2D.Common.Math.b2Vec2;
    private _radius: number;
    private _bodyCreated: bool;
    private _cell;
    private _distance: number;
    private _lastEntity: number;
    private _bonusObjectsRef: any;
    private _component: any;
    private _camera: Camera;

    constructor(game: Core.Game) {
        super(game);

        this._game = game;
        this._objArray = game.Content.loadFile("objects.json");
        this._bonusArray = game.Content.loadFile("bonuses.json");
        if (this._objArray != null) {
            this._currObjArray = this._objArray["lvl-1"];   // Like always we must have level 1 objects so no need to test if not null
        }
        this._levelScore = 100;
        this._generatedBonus = -1;
        this._generatedObj = -1;
        this._level = 1;
        this._bonusIndex = -1;
        this._limit = 5;
        this._entityList = [];
        this._entityIndex = 0;
        this._speed = 0.06;
        this._timer = 0;
        this._distance = 4;
        this._initialPosition = new Box2D.Common.Math.b2Vec2((<HTMLCanvasElement>this._game.Services.GetService("HTMLCanvasElement")).width / Physics.getInstance().Scale - 2.5, -0.3);
        this._circleData = new Box2D.Common.Math.b2Vec2((<HTMLCanvasElement>this._game.Services.GetService("HTMLCanvasElement")).width - (2.5 * Physics.getInstance().Scale), ((<HTMLCanvasElement>this._game.Services.GetService("HTMLCanvasElement")).height + 10) / 2);
        this._radius = 2.2 * Physics.getInstance().Scale;
        this._bodyCreated = false;
        this._lastEntity = -1;
        this._bonusObjectsRef = { "JumpBonus": JumpBonus, "BrickProtectionBonus": BrickProtectionBonus };
        this._component = null;
        this._camera = Camera.getInstance();
    }

    Update(gameTime: Core.GameTime) {
        this.mouseAction();
        //this._timer += gameTime.ElapsedGameTime;
        var make: bool;
        if (this._entityList.length == 0) {
            make = true;
        } else {
            make = ((this._entityList[this._lastEntity] != null && (this._entityList[this._lastEntity].entity.Position.y /*- (this._entityList[this._lastEntity].info.height / Physics.getInstance().Scale / 3)*/)) > this._distance);
        }
        if (make && this._entityIndex < this._limit) {
            if (this._currObjArray != null && this._currObjArray.length > 0) {
                /* test if we pass to next level so we must push new level objects to _currObjArray, and increase the speed */
                var l;
                if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
                    this._level = Math.ceil(l);     // if l = 2.4 then ceil makes it l = 3
                    if (this._objArray["lvl-" + this._level] != null) {
                        this._currObjArray = this._currObjArray.concat(this._objArray["lvl-" + this._level]);
                    }

                    this._speed += 0.06;
                }

                if (this._bonusArray != null && this._bonusArray.length > 0) {
                    this._generatedBonus = Math.floor(Math.random() * this._bonusArray.length);
                    /* now we have to add it to _currObjArray, after pop the previous one */
                    if (this._currObjArray[this._bonusIndex] != null) {
                        this._currObjArray.splice(this._bonusIndex, 1); // remove the previous one first
                    }
                    this._currObjArray.push(this._bonusArray[this._generatedBonus]);    // push it into the array (last position)
                    this._bonusIndex = this._currObjArray.length - 1;
                }

                this._generatedObj = Math.floor(Math.random() * this._currObjArray.length);

                if (this._currObjArray[this._generatedObj] != null) {
                    var name = this._currObjArray[this._generatedObj].name;
                    var texture = this._game.Content.loadImage(this._currObjArray[this._generatedObj].texture);
                    if (!this._entityList[this._entityIndex]) {
                        this._entityList[this._entityIndex] = { info: null, entity: null};
                    }
                    this._entityList[this._entityIndex].info = this._currObjArray[this._generatedObj];
                    this._entityList[this._entityIndex].entity = new Entity(this._game
                                          , { "Generated": { img: texture, animation: false } }
                                          , this._initialPosition
                                          , 0
                                          , name
                                          , { x: 0, y: 0, w: this._entityList[this._entityIndex].info.width, h: this._entityList[this._entityIndex].info.height });
                    this._entityList[this._entityIndex].entity.setTexture("Generated");
                }

                this._lastEntity = this._entityIndex;
                this._entityIndex++;
                this._generatedObj = -1;
                this._timer = 0;
            }
        } else {
            if (this._entityIndex >= this._limit) {
                this._entityIndex = 0;
            }
        }

        if (this._entityList.length > 0) {
            for (var i = 0; i < this._entityList.length; ++i) {
                if (this._entityList[i] != undefined) {
                    this._entityList[i].entity.update(gameTime, new Box2D.Common.Math.b2Vec2(this._entityList[i].entity.Position.x, this._entityList[i].entity.Position.y + this._speed), 0);
                    this.checkMouseClick(i);
                }
            }
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        if (this._entityList.length > 0) {
            for (var i = 0; i < this._entityList.length; ++i) {
                if (this._entityList[i] != undefined) {
                    this._entityList[i].entity.draw(this._game.Services.GetService("CanvasRenderingContext2D"));
                }
            }
        }

        var ctx = this._game.Services.GetService("CanvasRenderingContext2D");
        ctx.beginPath();
        ctx.arc(this._circleData.x, this._circleData.y, this._radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.stroke();

        super.Draw(gameTime);
    }

    private checkMouseClick(item: number) {
        this._mouseState = Input.Mouse.GetState();
        if (this._mouseState.LeftButton) {
            if (this._mouseState.X > (this._circleData.x - this._radius) && this._mouseState.Y < (this._circleData.x + this._radius)
                && this._mouseState.Y > (this._circleData.y - this._radius + 0.5) && this._mouseState.Y < (this._circleData.y + this._radius - 0.5))
            {
                var x = this._entityList[item].entity.Position.x * Physics.getInstance().Scale;
                var y = this._entityList[item].entity.Position.y * Physics.getInstance().Scale;
                var w = this._entityList[item].info.width / 2;
                var h = this._entityList[item].info.height / 2;

                if ((this._mouseState.X > (x - w) && this._mouseState.X < (x + w))
                     && (this._mouseState.Y > (y - h) && this._mouseState.Y < (y + h))
                    && !this._bodyCreated)
                {
                    this._bodyCreated = true;
                    var obj = this._entityList[item];
                    this._cell = null;
                    if (obj.entity.Name == "Brick") {
                        this._cell = new Brick(this._game, obj.info.texture, x, y - this._camera.CanvasOffset.y, obj.info.name, false, obj.info.health, w * 2, h * 2, obj.info.fn, obj.info.fps, obj.info.frames);
                    } else if (obj.entity.Name == "Bonus") {
                        if (this._bonusObjectsRef[obj.info.type] != null) {
                            this._cell = new this._bonusObjectsRef[obj.info.type](this._game, obj.info.texture, x, y - this._camera.CanvasOffset.y, obj.info.name, true, w * 2, h * 2, obj.info.fn, obj.info.fps, obj.info.frames);
                        } else {
                            throw new Error("Bonus Type Does Not Exist !");
                        }
                    }
                    this._cell.Body.SetFixedRotation(true);
                    this.addToComponentList(this._cell);
                    Physics.getInstance().createMouseJoint(this._mouseState.X / Physics.getInstance().Scale, (this._mouseState.Y - this._camera.CanvasOffset.y) / Physics.getInstance().Scale, this._cell.Body);

                    delete this._entityList[item];
                }
            }
        }
    }

    private mouseAction() {
        this._mouseState = Input.Mouse.GetState();
        if (this._mouseState.LeftButton && this._bodyCreated) {
            Physics.getInstance().createMouseJoint(this._mouseState.X / Physics.getInstance().Scale, (this._mouseState.Y - this._camera.CanvasOffset.y) / Physics.getInstance().Scale);
        } else {
            Physics.getInstance().destroyMouseJoint();
            this._bodyCreated = false;
            if (this._cell != null) {
                this._cell.Body.SetFixedRotation(false);
                this._cell = null;
            }
        }
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
        /*for (var i = 0; i < this._entityList.length; ++i) {
            delete this._entityList[i].entity;
        }*/
        this._entityList.length = 0;
        this._entityIndex = 0;
        this._level = 1;
        this._speed = 0.06;
        if (this._objArray != null) {
            this._currObjArray = this._objArray["lvl-1"];
        }
    }

    public get Component() { return this._component; }
    public set Component(value) { this._component = value; }
}