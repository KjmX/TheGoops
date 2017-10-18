///<reference path="../Framework/GameComponent.ts"/>
///<reference path="Score.ts"/>
///<reference path="../Element/Soldier.ts"/>
///<reference path="../Element/Boss.ts"/>
///<reference path="../Common/Physics.ts"/>
///<reference path="../Common/Camera.ts"/>

class EnemyGenerator extends Core.GameComponent {

	private _soldierArray: any;		//contains all soldiers
	private _bossArray: any;		//contains all bosses
	private _enemyArray: any;		//contains all soldiers of current level (co)
	private _currentBossArray: any;
	private _currentSoldierArray: any;
	private _levelScore: number;
	private _generatedBoss: number;
    private _generatedEnemy: number;
    private _level: number;
    private _bossIndex: number;
    private _game: Core.Game;
    private _timer: number;
    private _isUpToSky: bool;
    private _isUpToSpace: bool;
    private _cvs: HTMLCanvasElement;
    private _physics: Physics;
    private _component: any;
    private _camera: Camera;
    private _isGenerated: bool;
    //private _initialPosition: Box2D.Common.Math.b2Vec2;



	constructor(game: Core.Game) {
        super(game);

		this._game = game;
		this._bossArray = game.Content.loadFile("bosses.json");
        this._soldierArray = game.Content.loadFile("soldiers.json");

        if (this._soldierArray != null) {
            this._currentSoldierArray = this._soldierArray["lvl-1"];   // Like always we must have level 1 soldiers so no need to test if not null
            this._enemyArray = this._currentSoldierArray;
            //console.log("-----------"+this._enemyArray);
        }
        if (this._bossArray != null) {
            this._currentBossArray = this._bossArray["lvl-1"];   // Like always we must have level 1 bosses so no need to test if not null
        }

        this._levelScore = 18;  // change in game testing ********
        this._generatedBoss = -1;
        this._generatedEnemy = -1;
        this._level = 1;
        this._bossIndex = -1;
        this._timer = 0;
        this._isUpToSky = false;
        this._isUpToSpace = false;
        this._cvs = this._game.Services.GetService("HTMLCanvasElement");
        this._physics = Physics.getInstance();
        this._camera = Camera.getInstance();
        this._component = null;
        this._isGenerated = false;
        //this._initialPosition = new Box2D.Common.Math.b2Vec2((<HTMLCanvasElement>this._game.Services.GetService("HTMLCanvasElement")).width / Physics.getInstance().Scale - 2.5, -0.3);

    }


    Update(gameTime: Core.GameTime) {
    	this._timer += gameTime.ElapsedGameTime;
    	if (this._timer > 15){
    		if(this._level == 1){//lvl ground--------------------------
	    		if (this._currentSoldierArray != null && this._currentSoldierArray.length > 0 && this._currentBossArray != null && this._currentBossArray.length > 0){
	    			var l;
	                if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
	                	this._level = 2;
	                }
	    		}
	    	}//lvl ground ends


	    	if(this._level < 50 && this._level > 1){//sky lvl---------------------
	    		// check if first time to sky
	    		if(this._isUpToSky == false){ 
	    			this._isUpToSky = true;
	    			this._levelScore = 100;
	    			this._bossIndex = -1;
	    			if (this._soldierArray != null) {
		            	this._currentSoldierArray = this._soldierArray["lvl-2"];
		            	this._enemyArray = this._currentSoldierArray;
			        }
			        if (this._bossArray != null) {
			            this._currentBossArray = this._bossArray["lvl-2"];
			        }
	    		}

	    		//in normal sky levels
	    		//...sky soldiers added depending on level
	    		if (this._currentSoldierArray != null && this._currentSoldierArray.length > 0) {
	    			var l; //1st time in sky need 2001 score to get to lvl 3 (means longer time compared to others)
	                if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
	                    this._level = Math.ceil(l);     // if l = 2.4 then ceil makes it l = 3
	                    if (this._soldierArray["lvl-" + this._level] != null) {
	                        this._currentSoldierArray = this._currentSoldierArray.concat(this._soldierArray["lvl-" + this._level]);
	                    }
	                }
	    		}

	    		//...sky bosses added depending on level
	    		if (this._currentBossArray != null && this._currentBossArray.length > 0) {
	    			var ll;
	                if ((ll = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
	                    this._level = Math.ceil(ll);     // if ll = 2.4 then ceil makes it ll = 3
	                    if (this._bossArray["lvl-" + this._level] != null) {
	                        this._currentBossArray = this._currentBossArray.concat(this._bossArray["lvl-" + this._level]);
	                    }
	                }
	    		}


	    	}//sky lvl ends


	    	if(this._level > 50){//space lvl-------------------
	    		// check if first time to space
	    		if(this._isUpToSpace == false){ 
	    			this._isUpToSpace = true;
	    			this._bossIndex = -1;
	    			//this._levelScore = 2000;
	    			if (this._soldierArray != null) {
		            	this._currentSoldierArray = this._soldierArray["lvl-50"];
		            	this._enemyArray = this._currentSoldierArray;
			        }
			        if (this._bossArray != null) {
			            this._currentBossArray = this._bossArray["lvl-50"];
			        }
	    		}

	    		//in normal space levels
	    		//...space soldiers added depending on level
	    		if (this._currentSoldierArray != null && this._currentSoldierArray.length > 0) {
	    			var l; //1st time in sky need 2001 score to get to lvl 3 (means longer time compared to others)
	                if ((l = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
	                    this._level = Math.ceil(l);     // if l = 2.4 then ceil makes it l = 3
	                    if (this._soldierArray["lvl-" + this._level] != null) {
	                        this._currentSoldierArray = this._currentSoldierArray.concat(this._soldierArray["lvl-" + this._level]);
	                    }
	                }
	    		}

	    		//...space bosses added depending on level
	    		if (this._currentBossArray != null && this._currentBossArray.length > 0) {
	    			var ll;
	                if ((ll = (<Score>this._game.Services.GetService("Score")).Score / this._levelScore) > this._level) {
	                    this._level = Math.ceil(ll);     // if ll = 2.4 then ceil makes it ll = 3
	                    if (this._bossArray["lvl-" + this._level] != null) {
	                        this._currentBossArray = this._currentBossArray.concat(this._bossArray["lvl-" + this._level]);
	                    }
	                }
	    		}

	    	}//space lvl never ends

    		if (this._currentBossArray != null && this._currentBossArray.length > 0) {
    			this._generatedBoss = Math.floor(Math.random() * this._currentBossArray.length);
    			/* now we have to add it to _enemyArray, after pop the previous one */
    			if (this._enemyArray[this._bossIndex] != null) {
                    this._enemyArray.splice(this._bossIndex, 1); // remove the previous one first
                }
                this._enemyArray.push(this._currentBossArray[this._generatedBoss]);    // push it into the array (last position)
                this._bossIndex = this._enemyArray.length - 1;
    		}

    	    //we generate an enemy from the array of (n soldier + 1 boss)
    		if (this._enemyArray != null) {
    		    this._generatedEnemy = Math.floor(Math.random() * this._enemyArray.length);
    		}
    		//create the soldier or boss
    		if (this._enemyArray != undefined && this._enemyArray[this._generatedEnemy] != null) {

    			var S = this._enemyArray[this._generatedEnemy];
    			var x; 
    			var y;
    			if(this._generatedEnemy == this._enemyArray.length - 1)
    			{
    			    // generate boss
    			    var rand = Math.random();
    			    if (rand <= S.chance) {
    			        if (this._level == 1) {
    			            x = -0.3;
    			            y = (this._cvs.height - 40) - this._camera.CanvasOffset.y;
    			        }
    			        else {
    			            x = -0.3;
    			            y = (this._cvs.height - 360) - this._camera.CanvasOffset.y;
    			        }
    			        var boss = new Boss(this._game, S.texture, x, y, S.name, S.width, S.height, S.fn, S.fps, S.frames);
    			        this.addToComponentList(boss);
    			        this._isGenerated = true;
    			    }
    			}
    			else{
    				// generate soldier
    				if(this._level == 1){
    					x = 0.3;
    					y = (this._cvs.height - 40) - this._camera.CanvasOffset.y;
    				}
    				else{
    					x = -0.3;
    					y = (this._cvs.height - 360) - this._camera.CanvasOffset.y;
    				}
    				var soldier = new Soldier(this._game, S.texture, x, y, S.name, S.width, S.height, S.fn, S.fps, S.frames);
    				this.addToComponentList(soldier);
    				this._isGenerated = true;
    			}
    		}

    		if (this._isGenerated) {
    		    this._timer = 0;
    		    this._isGenerated = false;
    		}
    	}


    	super.Update(gameTime);
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
        this._level = 1;
        this._timer = 0;
        this._levelScore = 18;
        this._isUpToSky = false;
        this._isUpToSpace = false;
        this._isGenerated = false;
        if (this._soldierArray != null) {
            this._currentSoldierArray = this._soldierArray["lvl-1"];
            this._enemyArray = this._currentSoldierArray;
        }
        if (this._bossArray != null) {
            this._currentBossArray = this._bossArray["lvl-1"];
        }
    }

    public get Component() { return this._component; }
    public set Component(value) { this._component = value; }

//(1,0)joint point
}
