///<reference path="../Framework/GameComponent.ts"/>
///<reference path="../Common/Physics.ts"/>
///<reference path="../Common/Camera.ts"/>
///<reference path="../Element/Cell.ts"/>
///<reference path="../Element/Player.ts"/>
///<reference path="../Element/Static.ts"/>

class Controller extends Core.GameComponent {

    private _physics: Physics;
    private _camera: Camera;
    private _top: number;
    private _bottom: number;
    private _right: number;
    private _left: number;
    private _cvs: HTMLCanvasElement;

    constructor(game: Core.Game) {
        super(game);

        this._physics = Physics.getInstance();
        this._camera = Camera.getInstance();
        this._cvs = game.Services.GetService("HTMLCanvasElement");

        this._top = -200;
        this._bottom = this._cvs.height + 600;
        this._left = -200;
        this._right = this._cvs.width + 200;
    }

    Update(gameTime: Core.GameTime) {
        for (var b = this._physics.World.GetBodyList(); b != null; b = b.GetNext()) {
            var pos = b.GetPosition();

            if ((pos.x * this._physics.Scale) < this._left || (pos.x * this._physics.Scale) > this._right
                || (pos.y * this._physics.Scale) < this._top - this._camera.CanvasOffset.y || (pos.y * this._physics.Scale) > this._bottom - this._camera.CanvasOffset.y)
            {
                if ((b.GetUserData() != null) && (b.GetUserData().ref != null) && !(b.GetUserData().ref instanceof Player) && !(b.GetUserData().ref instanceof Static) && (b.GetUserData().ref instanceof Cell)) {
                    (<Cell>b.GetUserData().ref).markAsDead = true;
                    console.log("Deleting " + b.GetUserData().ref);
                }
            }
        }

        super.Update(gameTime);
    }
}