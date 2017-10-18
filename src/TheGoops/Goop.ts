///<reference path="Framework/Game.ts"/>
///<reference path="ThirdParty/Stats.d.ts"/>
///<reference path="Framework/Input/Mouse.ts"/>
///<reference path="Framework/Input/MouseState.ts"/>
///<reference path="Framework/Input/Keyboard.ts"/>
///<reference path="Framework/Input/KeyboardState.ts"/>
///<reference path="GameCore/StartScene.ts"/>
///<reference path="GameCore/ActionScene.ts"/>
///<reference path="GameCore/EventAggregator.ts"/>
///<reference path="GameCore/Events/GamePaused.ts"/>
///<reference path="GameCore/PopupScene.ts"/>
///<reference path="GameCore/Events/PlayScene.ts"/>
///<reference path="GameCore/PauseScene.ts"/>

///<reference path="Adventure/AdventureScene.ts"/>
///<reference path="Adventure/PackLevels.ts"/>
///<reference path="Adventure/LevelReader.ts"/>
///<reference path="GameCore/AdventurePauseScene.ts"/>


class Goop extends Core.Game implements IListener {

    private _cvs: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _stats: Stats;
    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _currKeyboardState: Input.KeyboardState;
    private _oldKeyboardState: bool;
    private _startScene: StartScene;
    private _actionScene: ActionScene;
    private _activeScene: GameScene;
    private _previousScene: GameScene;
    private _ea: EventAggregator;
    private _popupScene: PopupScene;
    private _pauseScene: PauseScene;

    private _adventureScene: AdventureScene;
    private _packLevelsScene: PackLevels;
    private _levelReader: LevelReader;

    constructor {
        super();
    }

    Initialize() {

        this._cvs = <HTMLCanvasElement>document.createElement("canvas");

        this._cvs.width = 720;

        this._cvs.height = 480;

        document.body.appendChild(this._cvs);

        this.Services.AddService("HTMLCanvasElement", this._cvs);

        this._stats = new Stats();
        this._cvs.parentElement.appendChild(this._stats.domElement);

        Input.Mouse.addMouseEvents(this._cvs);
        Input.Keyboard.addKeyboardEvents();

        this._oldMouseState = Input.Mouse.GetState();
        this._oldKeyboardState = false;

        this._ea = EventAggregator.getInstance();
        this._ea.Subscribe(this, PlayScene);

        super.Initialize();
    }

    LoadContent() {
        this._ctx = this._cvs.getContext("2d");

        this.Services.AddService("CanvasRenderingContext2D", this._ctx);

        /*
        * Start Scene
        */
        this._startScene = new StartScene(this);
        this.Components.Add(this._startScene);
        
        /*
        * Action Scene
        */
        this._actionScene = new ActionScene(this);
        this.Components.Add(this._actionScene);

        /*
        * Adventure Scene
        */
        this._adventureScene = new AdventureScene(this);
        this.Components.Add(this._adventureScene);
        this._packLevelsScene = new PackLevels(this);
        this.Components.Add(this._packLevelsScene);
        this._levelReader = new LevelReader(this);
        this.Components.Add(this._levelReader);

        /*
        * Popup Scene
        */
        this._popupScene = new PopupScene(this);
        this.Components.Add(this._popupScene);

        /*
        * Pause Scene
        */
        this._pauseScene = new PauseScene(this);
        this.Components.Add(this._pauseScene);
        
        this._startScene.Show();
        this._activeScene = this._startScene;
        this._previousScene = null;

        super.LoadContent();
    }

    Update(gameTime: Core.GameTime) {

        super.Update(gameTime);

        this._stats.update();
    }

    Draw(gameTime: Core.GameTime) {
        this._ctx.clearRect(0, 0, this._cvs.width, this._cvs.height);

        this.HandleScenesInput();

        super.Draw(gameTime);
    }

    private HandleScenesInput() {
        if (this._activeScene == this._startScene) {
            this.HandleStartSceneInput();
        } else if (this._activeScene == this._actionScene) {
            this.HandleActionSceneInput();
        } else if (this._activeScene == this._popupScene) {
            if (!this._popupScene.PopupIsWaiting) {
                this.ShowScene(this._previousScene);
            }
        } else if (this._activeScene == this._pauseScene) {
            this.HandleActionScenePauseInput();
        } else if (this._activeScene == this._adventureScene) {
            this.HandleAdventureSceneInput();
        } else if (this._activeScene == this._packLevelsScene) {
            this.HandlePackLevelsSceneInput();
        }

        if (this._activeScene != this._popupScene && this._popupScene.PopupIsWaiting ) {
            this.ShowScene(this._popupScene, this._popupScene.Popup.transparent);
        }
    }

    private HandleStartSceneInput() {
        this._currMouseState = Input.Mouse.GetState();
        if (!this._currMouseState.LeftButton && this._oldMouseState.LeftButton) {
            switch (this._startScene.SelectedMenuIndex) {
                case MenuList.START:
                    this.ShowScene(this._actionScene);
                    break;
                case MenuList.ADVENTURE:
                    this.ShowScene(this._adventureScene);
                    break;
            }
        }
        this._oldMouseState = this._currMouseState;
    }

    private HandleActionSceneInput() {
        //this._currKeyboardState = Input.Keyboard.GetState();
        /*if (this._currKeyboardState.IsKeyDown(80) && !this._oldKeyboardState) {
            console.log("You pressed Pause");
            this._oldKeyboardState = true;
            if (this._actionScene.Paused) {
                this._ea.Publish(new GamePaused(false));
            } else {
                this._ea.Publish(new GamePaused(true));
                this.ShowScene(this._pauseScene, true);
            }
        }*/
        if (this._actionScene.ShowPauseScene) {
            if (this._actionScene.Paused) {
                this._ea.Publish(new GamePaused(false));
            } else {
                this._ea.Publish(new GamePaused(true));
                this.ShowScene(this._pauseScene, true);
            }
        }
        /*if (this._currKeyboardState.IsKeyUp(80)) {
            this._oldKeyboardState = false;
        }*/
    }

    private HandleActionScenePauseInput() {
        if (this._pauseScene.SelectedItem == ActionScenePauseList.RESUME) {
            this._ea.Publish(new GamePaused(false));
            this._actionScene.ShowPauseScene = false;
            this.ShowScene(this._actionScene);
        } else if (this._pauseScene.SelectedItem == ActionScenePauseList.REPLAY) {
            this._actionScene.Replay();
            this._ea.Publish(new GamePaused(false));
            this.ShowScene(this._actionScene);
        } else if (this._pauseScene.SelectedItem == ActionScenePauseList.MAINMENU) {
            this._actionScene.Replay();
            this._ea.Publish(new GamePaused(false));
            this._actionScene.Hide();
            this.ShowScene(this._startScene);
        }
    }

    private HandleAdventureSceneInput() {
        this._currMouseState = Input.Mouse.GetState();
        if (!this._currMouseState.LeftButton && this._oldMouseState.LeftButton) {
            if (this._adventureScene.SelectedPack != null) {
                this._packLevelsScene.setPack(this._adventureScene.SelectedPack);
                this.ShowScene(this._packLevelsScene);
            }
        } else if (this._adventureScene.Back) {
            this._adventureScene.Back = false;
            this.ShowScene(this._startScene);
        }
        this._oldMouseState = this._currMouseState;
    }

    private HandlePackLevelsSceneInput() {
        this._currMouseState = Input.Mouse.GetState();
        if (!this._currMouseState.LeftButton && this._oldMouseState.LeftButton) {
            if (this._packLevelsScene.SelectedLevel != null) {
                this._levelReader.readLevel(this._packLevelsScene.SelectedLevel);
                this.ShowScene(this._levelReader);
            }
        } else if (this._packLevelsScene.Back) {
            this._packLevelsScene.Back = false;
            this.ShowScene(this._adventureScene);
        }
        this._oldMouseState = this._currMouseState;
    }

    private ShowScene(scene: GameScene, drawOnly?: bool) {
        this._activeScene.Hide();
        if (drawOnly != undefined && drawOnly == true) {
            this._activeScene.setVisible(true);
        }
        this._previousScene = this._activeScene;
        this._activeScene = scene;
        scene.Show();
    }

    /*
    * Event Handling function
    */
    EventNotify(sub: any, message?: any): void {
        if (sub instanceof PlayScene) {
            switch ((<PlayScene>sub).Scene) {
                case SceneName.MAINMENU:
                    this._previousScene.setVisible(false);
                    this.ShowScene(this._startScene);
                    break;
                case SceneName.PACKLVL:
                    this._previousScene.setVisible(false);
                    this.ShowScene(this._packLevelsScene);
                    break;
            }
        }
    }
}