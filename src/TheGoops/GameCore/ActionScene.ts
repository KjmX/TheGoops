///<reference path="GameScene.ts"/>
///<reference path="../Interfaces/IListener.ts"/>
///<reference path="../Framework/Input/Keyboard.ts"/>
///<reference path="../Framework/Input/KeyboardState.ts"/>
///<reference path="../Common/Physics.ts"/>
///<reference path="../Common/Contact.ts"/>
///<reference path="../Common/Camera.ts"/>
///<reference path="../Element/Static.ts"/>
///<reference path="../Element/Player.ts"/>
///<reference path="../Element/Cannon.ts"/>
///<reference path="BricksGenerator.ts"/>
///<reference path="EnemyGenerator.ts"/>
///<reference path="Score.ts"/>
///<reference path="Events/CellDispose.ts"/>
///<reference path="Events/GamePaused.ts"/>
///<reference path="Events/GameOver.ts"/>
///<reference path="Controller.ts"/>
///<reference path="StaticGenerator.ts"/>
///<reference path="EnvironmentGenerator.ts"/>
///<reference path="PopupDialogs/GameOverPopup.ts"/>
///<reference path="EffectGenerator.ts"/>
///<reference path="BackgroundGenerator.ts"/>

class ActionScene extends GameScene implements IListener {

    private _hudComponent: Core.GameComponent[];
    private _cvs: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _game: Core.Game;
    private _physics: Physics;
    private _world: Box2D.Dynamics.b2World;
    private _contact: Contact;
    private _camera: Camera;
    private _player: Player;
    private _ground: Static;
    private _brickGenerator: BricksGenerator;
    private _enemyGenerator: EnemyGenerator;
    private _score: Score;
    private _cbDV: HTMLElement;
    private _keyboardState: Input.KeyboardState;
    private _ea: EventAggregator;
    private _moveCamera: bool;
    private _movedCameraDistance: number;
    private _controller: Controller;
    private _staticGenerator: StaticGenerator;
    private _envGenerator: EnvironmentGenerator;
    private _bulletGenerator: BulletGenerator;
    private _background: Entity;
    private _cannon: Cannon;
    private _prevKeyState: bool;
    private _effectGenerator: EffectGenerator;
    private _btnPause: Button;
    private _showPauseScene: bool;
    private _backgroundGenerator: BackgroundGenerator;
    private _camCounter: number;
    private _startEnvGen: bool;

    private _paused: bool;

    private _backGroundMusic: HTMLAudioElement;

    constructor(game: Core.Game) {
        super(game);
        this._hudComponent = [];
        this._cvs = game.Services.GetService("HTMLCanvasElement");
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._game = game;

        // Physics
        this._physics = Physics.getInstance();
        this._physics.createWorld(new Box2D.Common.Math.b2Vec2(0, 10), true);
        this._world = this._physics.World;

        // Camera
        this._camera = Camera.getInstance();
        this._camera.Canvas = this._cvs;
        this._camera.Ctx = this._ctx;
        this._camera.CanvasOffset = { x: 0, y: 0 };
        this._camera.ViewCenterPixel = { x: 360, y: 240 };
        this._camera.Scale = 1;
        this._moveCamera = false;
        this._movedCameraDistance = 0;
        this._camCounter = 0;

        // Input
        Input.Keyboard.addKeyboardEvents();
        this._prevKeyState = false;

        // Game Stuff
        this._ground = new Static(game, "", this._cvs.width / 2, this._cvs.height, "Ground", 600, 10);
        game.Services.AddService("Ground", this._ground);

        this._cbDV = document.getElementById("cbDebugView");

        this._envGenerator = new EnvironmentGenerator(game);
        this._envGenerator.setEnabled(false);
        this._envGenerator.setVisible(false);
        this.Components.push(this._envGenerator);
        this._startEnvGen = false;

        this._player = new Player(game);
        this.Components.push(this._player);

        this._contact = new Contact();
        this._contact.startContactListener(this._world);

        //this._score = new Score(game);
        game.Services.AddService("Score", this._player.Score);
        this._hudComponent.push(this._player.Score);

        this._brickGenerator = new BricksGenerator(game);
        this._brickGenerator.Component = this.Components;
        this._hudComponent.push(this._brickGenerator);

        this._enemyGenerator = new EnemyGenerator(game);
        this._enemyGenerator.Component = this.Components;
        this.Components.push(this._enemyGenerator);

        this._staticGenerator = new StaticGenerator(game);
        this.Components.push(this._staticGenerator);

        this._bulletGenerator = BulletGenerator.getInstance();
        this._bulletGenerator.Component = this.Components;

        this._cannon = new Cannon(game, this._cvs);
        this._hudComponent.push(this._cannon);

        this._btnPause = new Button(game.Content.loadImage("pauseBtnSmall.png"), 20, 50, 35, 35);
        this._showPauseScene = false;

        this._backgroundGenerator = new BackgroundGenerator(game);
        this.Components.push(this._backgroundGenerator);

        this._physics.activateDebugView(this._ctx, true);

        //EventAggregator.getInstance().Subscribe(this, this._player);
        this._ea = EventAggregator.getInstance();
        this._ea.Subscribe(this, CellDispose);
        this._ea.Subscribe(this, GamePaused);
        this._ea.Subscribe(this, GameOver);
        this._ea.Subscribe(this, ButtonAction);

        // Controller
        this._controller = new Controller(game);
        this.Components.push(this._controller);

        // Pause
        this._paused = false;

        //Background
        this._background = new Entity(game, { "Background": { img: game.Content.loadImage("dah2.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(12, 8), 0, "Backgroudn");
        this._background.setTexture("Background");

        //Effects
        this._effectGenerator = EffectGenerator.getInstance(game);
        this.Components.push(this._effectGenerator);

        this._backGroundMusic = game.Content.loadAudio("019_Field02");
    }

    Update(gameTime: Core.GameTime) {

        this._keyboardState = Input.Keyboard.GetState();
        if (this._keyboardState.IsKeyDown(90)) {
            //console.log("'Z' is pressed");
            //this._camera.zoomIn();
            this._cannon.up();
            //this._score.addScore(this._score.Score + 1000);
        }
        if (this._keyboardState.IsKeyDown(83)) {

            this._cannon.down();

        }
        if (this._keyboardState.IsKeyDown(68) && !this._prevKeyState) { //D
            this._cannon.shot();
            this._prevKeyState = true;

        }
        if (this._keyboardState.IsKeyUp(68)) {
            this._prevKeyState = false;
        }

        // End

        this._btnPause.Update(gameTime);

        
        this.updateCameraPosition();

        this._world.Step(1 / 60, 10, 10);

        this._world.ClearForces()

        super.Update(gameTime);
        // hud is the final stuff to update (changing this after)
        for (var i = 0; i < this._hudComponent.length; i++) {
            if (this._hudComponent[i].getEnabled()) {
                this._hudComponent[i].Update(gameTime);
            }
        }
    }

    Draw(gameTime: Core.GameTime) {

        this._camera.beginDraw();

        //this._background.draw(this._ctx);
        for (var i = 0; i < this._backgroundGenerator.EntityArray.length; i++) {
            this._backgroundGenerator.EntityArray[i].draw(this._ctx);
        }

        if ((<HTMLInputElement>this._cbDV).checked)
            this._world.DrawDebugData();

        super.Draw(gameTime);

        this._camera.endDraw();

        this._btnPause.Draw(this._ctx, gameTime);

        // hud is the final stuff to draw (changing this after)
        for (var i = 0; i < this._hudComponent.length; i++) {
            if ((this._hudComponent[i] instanceof Core.DrawableGameComponent) &&
                (<Core.DrawableGameComponent>this._hudComponent[i]).getVisible()) {
                (<Core.DrawableGameComponent>this._hudComponent[i]).Draw(gameTime);
            }
        }
    }

    EventNotify(sub: any, message?: any): void {
        //alert("The Player Just Notify and said " + message);
        if (sub instanceof CellDispose) {
            var cell = (<CellDispose>sub).Cell;
            this.Components.splice(this.Components.indexOf(cell), 1);
            console.log("We have something here " + cell);
        } else if (sub instanceof GamePaused) {
            this._paused = (<GamePaused>sub).Pause;
            this.setEnabled(!this._paused);
        } else if (sub instanceof GameOver) {
            console.log("GameOver");
            new GameOverPopup(this._game, this);
        } else if (sub instanceof ButtonAction) {
            if ((<ButtonAction>sub).button == this._btnPause) {
                this._showPauseScene = true;
            }
        }
    }

    public get Paused() { return this._paused; }
    public get ShowPauseScene() { return this._showPauseScene; }
    public set ShowPauseScene(value) { this._showPauseScene = value; }

    /*
    * Change camera position
    */
    private updateCameraPosition() {
        if (this._moveCamera) {
            if (this._movedCameraDistance < this._cvs.height / 3) {
                this._camera.down(2);
                this._movedCameraDistance += 2;
                this._ea.Publish(new CameraMove());
            } else {
                this._movedCameraDistance = 0;
                this._moveCamera = false;
                this._camCounter++;
                if (this._camCounter >= 2 && !this._startEnvGen) {
                    this._envGenerator.setEnabled(true);
                    this._envGenerator.setVisible(true);
                    this._startEnvGen = true;
                }
            }
        }

        var body = this._physics.getBodyAtMouse(this._cvs.width / 2 / this._physics.Scale, (100 - this._camera.CanvasOffset.y) / this._physics.Scale);
        if (body) {
            var ref = body.GetUserData().ref;
            if (ref instanceof Brick) {
                if ((<Brick>ref).Body.GetJointList() != null && ((<Brick>ref).Body.GetJointList().joint instanceof Box2D.Dynamics.Joints.b2MouseJoint)) {
                    return;
                }
                if ((<Brick>ref).Body.GetLinearVelocity().x > 0.1 || (<Brick>ref).Body.GetLinearVelocity().x < -0.1
                    || (<Brick>ref).Body.GetLinearVelocity().y > 0.1 || (<Brick>ref).Body.GetLinearVelocity().y < -0.1) {
                    return;
                }
                //this._camera.down(this._cvs.height / 3);
                this._moveCamera = true;
            }
        }
    }

    /*
    * Replay
    */
    public Replay(): void {
        // delete the bricks and enemies and static
        var userdata = null;
        for (var b = this._physics.World.GetBodyList(); b; b = b.GetNext()) {
            userdata = b.GetUserData();
            if (userdata == null || userdata.ref == undefined || (!(userdata.ref instanceof Brick) && !(userdata.ref instanceof Enemy) && !(userdata.ref instanceof Bonus) && !(userdata.ref instanceof Bullet)) || userdata.ref == this._ground) {
                continue;
            }
            userdata.ref.markAsDead = true;
            userdata.ref.Dispose();
        }
        // not finished
        this._camera.CanvasOffset.x = 0;
        this._camera.CanvasOffset.y = 0;
        this._player.init();
        this._cannon.init();
        this._staticGenerator.init();
        this._brickGenerator.init();
        this._enemyGenerator.init();
        this._envGenerator.init();
        this._envGenerator.setEnabled(false);
        this._envGenerator.setVisible(false);
        this._effectGenerator.init();
        this._backgroundGenerator.init();
        this._showPauseScene = false;
        this._camCounter = 0;
        this._startEnvGen = false;
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