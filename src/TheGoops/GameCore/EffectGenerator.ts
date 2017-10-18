///<reference path="../Framework/DrawableGameComponent.ts"/>
///<reference path="../Element/Entity.ts"/>
///<reference path="../Element/Cell.ts"/>

class EffectGenerator extends Core.DrawableGameComponent{
	private static _instance: EffectGenerator;
	private _game : Core.Game;
	private _ctx: CanvasRenderingContext2D;
	private _effectsArray: any;
	private _simpleEffectsArray: { entity: Entity;  position: Box2D.Common.Math.b2Vec2; }[];
	private _trackEffectsArray: { entity: Entity;  object: any; }[];

	public static getInstance(game: Core.Game): EffectGenerator {
        if (_instance == null) {
            _instance = new EffectGenerator(game);
        }
        return _instance;
    }

    constructor(game: Core.Game){
        super(game);
        this.initialize(game);
    }

    private initialize(game){
        this._game = game;
        this._ctx = this._game.Services.GetService("CanvasRenderingContext2D");
        this._effectsArray = this._game.Content.loadFile("effects.json");
        if(this._effectsArray.length == 0) this._effectsArray = [];
        this._simpleEffectsArray = [];
        this._trackEffectsArray = [];
    }

    //info{obj:any, position:b2vec2}
    public addEffect(info: any, effectName: string, track: bool){
    	var index = this.checkEffect(effectName);
    	if(index != null){
    		var ig = this._game.Content.loadImage(this._effectsArray[index].texture);
    		var fw = this._effectsArray[index].width;
    		var fh = this._effectsArray[index].height;
    		var fn = this._effectsArray[index].fn;
    		var fs = this._effectsArray[index].speed;
    		var cs = this._effectsArray[index].frames;
    		
    		

    		if(track && info.obj != undefined){
    			var pos = (info.obj instanceof Cell) ? info.obj.body.GetPosition() : info.obj.GetPosition();
    			var angle = (info.obj instanceof Cell) ? info.obj.body.GetPosition() : info.obj.GetPosition();

    			var ent = new Entity(this._game, {"Effect": {img: ig, animation: true, anmOption:{ax: 0, ay: 0, frameNum: fn, frameW: fw, frameH: fh, frameI: 0, frameSpeed: fs, customize: cs}}}
    				, pos
    				, angle
    				, effectName
    				);
    			ent.setTexture("Effect");
    			this._trackEffectsArray.push({entity: ent, object: info.obj});
    		}
    		if(!track && info.position != undefined){
    		    var ent = new Entity(this._game, { "Effect": {img: ig, animation: true, anmOption:{ax: 0, ay: 0, frameNum: fn, frameW: fw, frameH: fh, frameI: 0, frameSpeed: fs, customize: cs}}}
    				, info.position
    				, 0
    				, effectName
    				);
    		    ent.setTexture("Effect");
    			this._simpleEffectsArray.push({entity: ent, position: info.position });
                console.log("we are here in simple gen  "+ this._simpleEffectsArray.length);
    		}
    	}
    }


    public removeEffect(info: any, effectName: string){

    }


    Update(gameTime: Core.GameTime) {
    	if(this._trackEffectsArray.length > 0){
    		for(var i=0; i < this._trackEffectsArray.length; i++){
    			var pos = (this._trackEffectsArray[i].object instanceof Cell) ? this._trackEffectsArray[i].object.body.GetPosition() : this._trackEffectsArray[i].object.GetPosition();
    			var angle=(this._trackEffectsArray[i].object instanceof Cell) ? this._trackEffectsArray[i].object.body.GetPosition() : this._trackEffectsArray[i].object.GetPosition();
    			this._trackEffectsArray[i].entity.update(gameTime, pos, angle);
    		}
    	}
        //console.log(this._simpleEffectsArray.length);
        //(T/_\°) amatirasu !
    	if(this._simpleEffectsArray.length > 0){
    		for(var i=0; i < this._simpleEffectsArray.length; i++){
    			var pos = this._simpleEffectsArray[i].position;
    			var angle = 0;
    			this._simpleEffectsArray[i].entity.update(gameTime, pos, angle);
                console.log("inside update inside simple effect .."+this._simpleEffectsArray.length);
                //remove from array if animation played once
                if(this._simpleEffectsArray[i].entity.PlayNumber > 0){
                    this._simpleEffectsArray.splice(i, 1);
                }
    		}
    	}

    	super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
    	if(this._trackEffectsArray.length > 0){
    		for(var i=0; i < this._trackEffectsArray.length; i++){
    			this._trackEffectsArray[i].entity.draw(this._ctx);
    		}
    	}
    	if(this._simpleEffectsArray.length > 0){
    		for(var i=0; i < this._simpleEffectsArray.length; i++){
    			this._simpleEffectsArray[i].entity.draw(this._ctx);
                console.log("am i really drawing ? but where ?");
    		}
    	}
    	//(°/_\°) itachi
    	super.Draw(gameTime);
    }

    private checkEffect(effectName: string): number{
    	for(var i = 0; i<this._effectsArray.length; i++){
    		if(this._effectsArray[i].name == effectName)
    			return i;
    	}
    	return null;
    }
    
    public init() {
        this._simpleEffectsArray.length = 0;
        this._trackEffectsArray.length = 0;
    }
}