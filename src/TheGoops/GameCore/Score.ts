///<reference path="../Framework/DrawableGameComponent.ts"/>

class Score extends Core.DrawableGameComponent {
	private _score : number;
	private _addedScore : number;
	private _highestDistance : number;
	private _ctx : CanvasRenderingContext2D;


	constructor(game: Core.Game) {
        super(game);

		this._score = 0;
		this._addedScore = 0;
		this._highestDistance = 0;
		this._ctx = this.Game.Services.GetService("CanvasRenderingContext2D");
		//this._ctx.font = 'italic 20pt Calibri';
        this._ctx.font = '15pt Showcard Gothic';
        this._ctx.fillStyle = 'black';
        
	}

	Initialize(): void { }

    LoadContent(): void { }

    //we give the distance from earth

    public addScore(distance: number){
    	if(this._highestDistance < distance){
    		this._addedScore += distance - this._highestDistance;
    		this._highestDistance = distance;
    	}
    }

    Update(gameTime: Core.GameTime) { 
    	if(this._addedScore > 0){
    		this._addedScore--;
    		this._score++;
    	}

    	super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {

    	//this.Game.Services.GetService("CanvasRenderingContext2D")
    	this._ctx.fillText(""+this._score+" meters",20,20);

    	super.Draw(gameTime);
    }

    public init() {
        this._score = 0;
        this._addedScore = 0;
        this._highestDistance = 0;
    }

    public get Score() : number { return this._score; }
}