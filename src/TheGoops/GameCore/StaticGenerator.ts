///<reference path="../Framework/GameComponent.ts"/>
///<reference path="../Common/Physics.ts"/>
///<reference path="../Common/Camera.ts"/>
///<reference path="../Element/Static.ts"/>
///<reference path="../Element/Brick.ts"/>

class StaticGenerator extends Core.GameComponent {
	private _game: Core.Game;
	private _camera: Camera;
    private _physics: Physics;
	private _cvs: HTMLCanvasElement;
	private _objCounter: number;
	private _currentObj: any;
	private _previousObj: any;
	private _staticArray: Static[];

	constructor(game: Core.Game) {
        super(game);

        this._game = game;
        this._camera = Camera.getInstance();
        this._physics = Physics.getInstance();
        this._cvs = game.Services.GetService("HTMLCanvasElement");
        this._objCounter = 0;
        this._staticArray = [];
    }


    Update(gameTime: Core.GameTime) {

    	this._currentObj = this._physics.getBodyAtMouse(this._cvs.width / 2 / this._physics.Scale, ((this._cvs.height+100) - this._camera.CanvasOffset.y) / this._physics.Scale);

    	if(this._currentObj && this._objCounter < 9){
    		if(this._previousObj)
    		{
    			if(this._currentObj != this._previousObj){
    				this._previousObj = this._currentObj;
    				this._objCounter++;
    			}
    		}
    		if(this._previousObj == undefined){
    			this._previousObj = this._currentObj;
    			this._objCounter++;
    		}
    		
    	}

    	if(this._objCounter == 9){
    		this._objCounter = 0;
    		var width = this._currentObj.GetUserData().ref.entity.Width;
            var height = this._currentObj.GetUserData().ref.entity.Height;
            var x = this._currentObj.GetPosition().x * this._physics.Scale;
            var y = this._currentObj.GetPosition().y * this._physics.Scale;
            (<Cell>this._currentObj.GetUserData().ref).markAsDead = true;
            var stat = new Static(this._game, "", x, y, "Static", width, height);
            this._staticArray.push(stat);
            console.log("generate static body");
    	}

    	super.Update(gameTime);
    }

    public init(): void {
        for (var i = 0; i < this._staticArray.length; ++i) {
            this._staticArray[i].markAsDead = true;
            this._staticArray[i].Dispose();
        }
    }

}