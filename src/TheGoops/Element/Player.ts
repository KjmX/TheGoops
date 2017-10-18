///<reference path="../Interfaces/IPlayer.ts"/>
///<reference path="Active.ts"/>
///<reference path="../GameCore/EventAggregator.ts"/>
///<reference path="../GameCore/Events/GameOver.ts"/>

class Player extends Active implements IPlayer {

    private _physics: Physics;
    private _img: HTMLImageElement;
    private _fw: number;
    private _fh: number;
    private _cvs: HTMLCanvasElement;
    private _joint: any;
    private _jointBody: Box2D.Dynamics.b2Body;
    private _jumpVelocity: number;
    private _hasBonus: bool;
    private _elapsedJumpTime: number;
    private _gameOver: bool;
    private _initPosition: Box2D.Common.Math.b2Vec2;
    private _gameOverTimer: number;
    private _score: Score;
    private _ground: Static;
    private _scoreUp: bool;
    private _contactAnimation: bool;
    private _airFrames: number[];
    private _contactFrames: number[];

    constructor(game: Core.Game) {
        this._physics = Physics.getInstance();
        this.name = 'Player';
        this.textureName = "player.png"; //"darthvader.png";
        this._fw = 60; //32;
        this._fh = 70; //48;
        this._cvs = <HTMLCanvasElement>game.Services.GetService("HTMLCanvasElement");

        this._img = game.Content.loadImage(this.textureName);
        
        this._initPosition = new Box2D.Common.Math.b2Vec2((this._cvs.width / 2) / this._physics.Scale, (this._cvs.height / 2) / this._physics.Scale);
        //this.body = this._physics.createRectangle((this._cvs.width / 2) / this._physics.Scale, 10 / this._physics.Scale, this._fw / this._physics.Scale, this._fh / this._physics.Scale, 'dynamic', { name: this.name, ref: this }, false);
        this.body = this._physics.createCircle(this._initPosition.x, this._initPosition.y, (this._fh / 2) / this._physics.Scale, 'dynamic', { name: this.name, ref: this }, false, { density: 0.001, allowSleep: false});

        this._jointBody = this._physics.createRectangle((this._cvs.width / 2) / this._physics.Scale, (this._cvs.height + 20) / this._physics.Scale, 5 / this._physics.Scale, 5 / this._physics.Scale, 'static', 'JointBody', true);

        this._joint = this._physics.createJoint(this.body, this._jointBody, "Prismatic", new Box2D.Common.Math.b2Vec2(0, 1));

        this._airFrames = [1];

        this.entity = new Entity(game,
                                { 'Player': { img: this._img, animation: true, anmOption: { ax: 0, ay: 0, frameNum: 30, frameW: this._fw, frameH: this._fh, frameI: 0, frameSpeed: 10, customize: this._airFrames } } }
                                , this.body.GetPosition()
                                , this.body.GetAngle()
                                , this.name);
        this.entity.setTexture(this.name);

        this._jumpVelocity = 40;

        this._hasBonus = false;

        this._elapsedJumpTime = 0;

        this._gameOver = false;

        this._gameOverTimer = 0;

        this._score = new Score(game);

        this._ground = game.Services.GetService("Ground");

        this._scoreUp = false;

        this._contactAnimation = false;

        this._contactFrames = [2, 3, 4, 5, 6, 7, 8, 9, 10];

        super(game);
    }

    Update(gameTime: Core.GameTime) {
        this.gameOver(gameTime.ElapsedGameTime);
        this.entity.update(gameTime, this.body.GetPosition(), this.body.GetAngle());
        this._elapsedJumpTime += gameTime.ElapsedGameTime;
        if (this._scoreUp) {
            this._score.addScore((this._ground.body.GetPosition().y) - (this.body.GetPosition().y));
        }

        if (this._contactAnimation && this.entity.PlayNumber >= 1) {
            this._contactAnimation = false;
            this.entity.Animation.setCustomizeFrames(this._airFrames);
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        //if (this._imgLoaded) {
            this.entity.draw(this.Game.Services.GetService("CanvasRenderingContext2D"));
        //}

        super.Draw(gameTime);
    }

    private gameOver(elapsedTime: number) {
        if (this._gameOver) {
            if (this._gameOverTimer < 3) {
                this._gameOverTimer += elapsedTime;
                return;
            }
            EventAggregator.getInstance().Publish(new GameOver());
        }
    }

    onContact(target: any, impulse: number, method: string): void {
        if (method == 'BEGIN') {
            /*
            * Jumping arround
            */
            this.entity.Animation.setCustomizeFrames(this._contactFrames);
            this._contactAnimation = true;            
            if (!this._hasBonus && this._elapsedJumpTime > 4) {
                this._gameOver = true;
                this._scoreUp = false;
            } else {
                var velocity = this.body.GetLinearVelocity();
                velocity.y = this._jumpVelocity;
                this.body.SetLinearVelocity(velocity);
                if (!this._hasBonus) {
                    this._scoreUp = true;
                }
            }
            
        } else if (method == 'POST') {
            console.log(target.name + " -> " + impulse);
            if (impulse < 0.3 || this._hasBonus == true) {
                return;
            }

            /*
            * Remove the joint
            */

            if (this._joint) {
                this._physics.World.DestroyJoint(this._joint);
                this._joint = null;
            }
            this._gameOver = true;
        }
        this._elapsedJumpTime = 0;
    }

    public DefaultValues() {
        this._jumpVelocity = 40;
        this._hasBonus = false;
        this._airFrames = [1];
        this._contactFrames = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    }

    /*
    * Method made for re-position the player and score
    */
    public init() {
        if (this.body) {
            this.body.SetTransform(new Box2D.Common.Math.b2Transform(this._initPosition, new Box2D.Common.Math.b2Mat22()));
            var velocity = this.body.GetLinearVelocity();
            velocity.y = 0;
            this.body.SetLinearVelocity(velocity);
            if (this._joint == null) {
                this.body.SetAngularVelocity(0);
                this.body.SetAngle(0);
                this._joint = this._physics.createJoint(this.body, this._jointBody, "Prismatic", new Box2D.Common.Math.b2Vec2(0, 1));
            }
        }
        this.DefaultValues();
        this._gameOver = false;
        this._gameOverTimer = 0;
        this._elapsedJumpTime = 0;
        this._score.init();
        this._scoreUp = false;
        this.entity.Animation.setCustomizeFrames([1]);
        this._contactAnimation = false;
    }

    public get JumpVelocity() { return this._jumpVelocity; }
    public set JumpVelocity(value) { this._jumpVelocity = value; }

    public get HasBonus() { return this._hasBonus; }
    public set HasBonus(value) { this._hasBonus = value; }

    public get GameOver() { return this._gameOver; }
    public set GameOver(value) { this._gameOver = value; }

    public get Score() { return this._score; }

    public get ScoreUp() { return this._scoreUp; }
    public set ScoreUp(value) { this._scoreUp = value; }

    public get AirFrames() { return this._airFrames; }
    public set AirFrames(value) { this._airFrames = value }

    public get ContactFrames() { return this._contactFrames; }
    public set ContactFrames(value) { this._contactFrames = value; }
}