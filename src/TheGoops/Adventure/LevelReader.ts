///<reference path="../GameCore/GameScene.ts"/>
///<reference path="Common/AdventurePhysics.ts"/>
///<reference path="Common/AdventureContact.ts"/>
///<reference path="Objects/Rope.ts"/>
///<reference path="Objects/Pulley.ts"/>
///<reference path="Objects/DynamicRopeSensor.ts"/>
///<reference path="Objects/Star.ts"/>
///<reference path="Objects/AdventurePlayer.ts"/>
///<reference path="Objects/AdventureBrick.ts"/>
///<reference path="Objects/Hammer.ts"/>
///<reference path="Objects/BigMama.ts"/>
///<reference path="AdventureBrickRepository.ts"/>
///<reference path="../GameCore/Events/CellDispose.ts"/>
///<reference path="../GameCore/PopupDialogs/AdventureClearPopup.ts"/>

enum Objects {
    STATIC,
    ROPE,
    PULLEY,
    DYNAMICROPESENSOR,
    STAR,
    PLAYER,
    BRICK,
    BIGMAMA
}

class LevelReader extends GameScene implements IListener {

    private _gearsArray: any[];
    private _jsGearsArray: any[];
    private _game: Core.Game;
    private _ctx: CanvasRenderingContext2D;
    private _physics: AdventurePhysics;
    private _cbDV: HTMLElement;
    private _contact: AdventureContact;
    private _ea: EventAggregator;
    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _brickRepository: AdventureBrickRepository;
    private _hammer: Hammer;
    private _background: Entity;
    private _hudComponent: Core.GameComponent[];
    private _currentLevel: string;
    private _cleaning: bool;
    private _won: bool;
    private _hammerBtn: Button;
    private _backGroundMusic: HTMLAudioElement;

    constructor(game: Core.Game) {
        super(game);

        this._hudComponent = [];
        this._gearsArray = [];
        this._game = game;
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._physics = AdventurePhysics.getInstance();
        this._cbDV = document.getElementById("cbDebugView");
        this._contact = new AdventureContact();
        this._contact.startContactListener(this._physics.World);
        this._physics.activateDebugView(game.Services.GetService("CanvasRenderingContext2D"), true);
        this._ea = EventAggregator.getInstance();
        this._ea.Subscribe(this, AdventureRemoveFromComponent);
        this._ea.Subscribe(this, CellDispose);
        this._ea.Subscribe(this, AdventureLevelDone);
        this._ea.Subscribe(this, ButtonAction);

        this._oldMouseState = Input.Mouse.GetState();
        
        //this._physics.DraggableBodies.push(AdventurePlayer);
        this._physics.DraggableBodies.push(AdventureBrick);
        this._physics.LaserAffectedBodies.push(Rope);

        this._brickRepository = new AdventureBrickRepository(game);
        this._hammer = new Hammer(game);
        this._hammer.Hide();
        this._hudComponent.push(this._hammer);
        this._hammer.addNail(AdventureBrick);

        this._background = null;
        this._currentLevel = null;
        this._cleaning = false;
        this._won = false;
        this._hammerBtn = new Button(game.Content.loadImage("hammerBtn.png"), 650, 30, 80, 80);

        this._backGroundMusic = game.Content.loadAudio("019_Field02");
    }

    public readLevel(name: string): void {
        //if (this.Components.length > 0 || this._gearsArray.length > 0)
        //    this.CleanLevel();

        var content = this._game.Content.loadFile(name + ".json");
        if (content == undefined) {
            return;
        }
        this._currentLevel = name;
        this._jsGearsArray = content.Objects;
        if (this._jsGearsArray == undefined) {
            this._jsGearsArray = [];
        }
        this._background = new Entity(this._game, { "LBackground": { img: this._game.Content.loadImage(content.Options.background), animation: false } }, new Box2D.Common.Math.b2Vec2(12, 8), 0, "LBackground");
        this._background.setTexture("LBackground");
        this._hammer.Shots = content.Options.hammer;
        this.createLevel();
    }

    private createLevel() {
        var obj = null;
        for (var i = 0; i < this._jsGearsArray.length; i++) {
            switch (this._jsGearsArray[i].object) {
                case Objects.STATIC:
                    obj = this._physics.createRectangle(this._jsGearsArray[i].x / this._physics.Scale, this._jsGearsArray[i].y / this._physics.Scale, this._jsGearsArray[i].width / this._physics.Scale, this._jsGearsArray[i].height / this._physics.Scale, this._jsGearsArray[i].type, "StaticAdv", false);
                    break;
                case Objects.ROPE:
                    var b1 = this._jsGearsArray[i].bodyA != undefined
                            && this._gearsArray[this._jsGearsArray[i].bodyA] != undefined
                            && this._gearsArray[this._jsGearsArray[i].bodyA] instanceof Cell
                                ? this._gearsArray[this._jsGearsArray[i].bodyA].Body
                                : this._gearsArray[this._jsGearsArray[i].bodyA];
                    var b2 = this._jsGearsArray[i].bodyB != undefined
                            && this._gearsArray[this._jsGearsArray[i].bodyB] != undefined
                            && this._gearsArray[this._jsGearsArray[i].bodyB] instanceof Cell
                                ? this._gearsArray[this._jsGearsArray[i].bodyB].Body
                                : this._gearsArray[this._jsGearsArray[i].bodyB];
                    obj = new Rope(this._game, b1, b2);
                    this.Components.push(obj);
                    break;
                case Objects.PULLEY:
                    obj = new Pulley(this._game, this._jsGearsArray[i].x, this._jsGearsArray[i].y, this._jsGearsArray[i].length);
                    this.Components.push(obj);
                    break;
                case Objects.DYNAMICROPESENSOR:
                    obj = new DynamicRopeSensor(this._game, this._jsGearsArray[i].x, this._jsGearsArray[i].y, this._jsGearsArray[i].radius);
                    this.Components.push(obj);
                    break;
                case Objects.STAR:
                    obj = new Star(this._game, this._jsGearsArray[i].x, this._jsGearsArray[i].y);
                    this.Components.push(obj);
                    break;
                case Objects.PLAYER:
                    obj = new AdventurePlayer(this._game, this._jsGearsArray[i].x, this._jsGearsArray[i].y);
                    this.Components.push(obj);
                    break;
                case Objects.BRICK:
                    var info = this._brickRepository.getBrickInfo(this._jsGearsArray[i].type);
                    if (info != null) {
                        obj = new AdventureBrick(this._game, info.texture, this._jsGearsArray[i].x, this._jsGearsArray[i].y, info.name, false, info.health, info.width, info.height, info.fn, info.fps, info.frames);
                        this.Components.push(obj);
                    }
                    break;
                case Objects.BIGMAMA:
                    obj = new BigMama(this._game, this._jsGearsArray[i].x, this._jsGearsArray[i].y);
                    this.Components.push(obj);
                    break;
            }
            if (obj != null) {
                this._gearsArray.push(obj);
            }
        }
    }

    Update(gameTime: Core.GameTime) {

        this._currMouseState = Input.Mouse.GetState();
        
        if (!this._hammer.Activate) {
            this._physics.updateMouseAction(this._currMouseState, this._oldMouseState);
            this._physics.updateLaserAction(this._currMouseState, this._oldMouseState);
        }

        /*if (this._currMouseState.LeftButton && !this._oldMouseState.LeftButton) {
            
        }*/

        this._oldMouseState = this._currMouseState;

        this._hammerBtn.Update(gameTime);

        this._physics.World.Step(1 / 60, 10, 10);

        this._physics.World.ClearForces();

        super.Update(gameTime);

        for (var i = 0; i < this._hudComponent.length; i++) {
            if (this._hudComponent[i].getEnabled()) {
                this._hudComponent[i].Update(gameTime);
            }
        }
    }

    Draw(gameTime: Core.GameTime) {
        if (this._background != null) {
            this._background.draw(this._ctx);
        }

        if ((<HTMLInputElement>this._cbDV).checked)
            this._physics.World.DrawDebugData();

        this._physics.drawLaserAction(this._ctx, this._currMouseState);

        super.Draw(gameTime);

        this._hammerBtn.Draw(this._ctx, gameTime);

        for (var i = 0; i < this._hudComponent.length; i++) {
            if ((this._hudComponent[i] instanceof Core.DrawableGameComponent) &&
                (<Core.DrawableGameComponent>this._hudComponent[i]).getVisible()) {
                (<Core.DrawableGameComponent>this._hudComponent[i]).Draw(gameTime);
            }
        }
    }

    public Replay(readLvl?: bool) {
        this.CleanLevel();
        console.log(this._physics.World.GetBodyCount());
        this._cleaning = false;
        this._won = false;
        if (!readLvl) {
            this.readLevel(this._currentLevel);
        }
    }

    public CleanLevel() {
        this._cleaning = true;
        for (var i = 0; i < this._gearsArray.length; i++) {
            if (this._gearsArray[i] instanceof Box2D.Dynamics.b2Body) {
                var body = this._gearsArray[i];
                this._physics.World.DestroyBody(body);
            } else {
                this._gearsArray[i].Dispose();
            }
        }

        this.Components.length = 0;
        this._gearsArray.length = 0;
        this._hammer.init();
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof AdventureRemoveFromComponent) {
            this.Components.splice(this.Components.indexOf((<AdventureRemoveFromComponent>sub).Obj), 1);
        } else if (sub instanceof CellDispose) {
            var cell = (<CellDispose>sub).Cell;
            this.Components.splice(this.Components.indexOf(cell), 1);
            if (!this._cleaning) {
                this._gearsArray.splice(this._gearsArray.indexOf(cell), 1);
            }
        } else if (sub instanceof AdventureLevelDone) {
            if (!this._won) {
                var player = (<AdventureLevelDone>sub).Player;
                new AdventureClearPopup(this._game, this, player);
                this._won = true;
            }
        } else if (sub instanceof ButtonAction) {
            if ((<ButtonAction>sub).button == this._hammerBtn) {
                if (this._hammer.Activate) {
                    this._hammer.Hide();
                } else {
                    this._hammer.Show();
                }
            }
        }
    }

    public Show() {
        SoundManager.playSound(this._backGroundMusic);
        this._backGroundMusic.loop = true;
        super.Show();
    }

    public Hide() {
        SoundManager.pauseMusic(this._backGroundMusic);
        super.Hide();
    }
}