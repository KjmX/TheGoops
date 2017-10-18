///<reference path="IGame.ts"/>
///<reference path="GameTime.ts"/>
///<reference path="GameService.ts"/>
///<reference path="GameComponent.ts"/>
///<reference path="DrawableGameComponent.ts"/>
///<reference path="GameComponentArray.ts"/>
///<reference path="ContentManager.ts"/>
///<reference path="Loader.ts"/>
///<reference path="IWindow.ts"/>

module Core {
    export class Game implements IGame {

        private _gameTime: GameTime;
        private _elapsedGameTime: Date;
        private _fps: number;
        private _gameServices: GameService;
        private _drawableComponents: IDrawable[];
        private _gameComponents: GameComponentArray;
        private _initializedComponents: IGameComponent[];
        private _updateableComponents: IUpdateable[];
        private _content: ContentManager;
        private _loader: Loader;

        constructor() {
            this._gameTime = new GameTime();
            this._gameServices = new GameService();
            this._fps = 60;
            this._drawableComponents = [];
            this._initializedComponents = [];
            this._updateableComponents = [];
            this._gameComponents = new GameComponentArray(this);
            this._content = new ContentManager();
            this._loader = new Loader(this);
        }

        // Call this method to initialize the game, begin running the game loop
        public Run(): void {
            this._loader.loadAssets(this.RunGame);
        }

        private RunGame(assets: any): void {
            try {
                this._content.Assets = assets;
                this.Initialize();
                //this._gameTime.ElapsedGameTime = Date.now();
                this.Update(this._gameTime);
                this.InitAnimFrame();
                this.StartGameLoop();
            }
            catch (exception) {
                console.log(exception);
            }
        }

        private InitAnimFrame(): void {
            var fps = this._fps;
            window.requestAnimFrame = (function () {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function (callback, element?) {
                        window.setTimeout(callback, 1000 / fps);
                    };
            })();
        }

        private StartGameLoop(): void {
            //setInterval((e) => {
            this._gameTime.Stop();
            this.Update(this._gameTime);
            this.Draw(this._gameTime);
            this._gameTime.Start();
            window.requestAnimFrame(this.StartGameLoop.bind(this));
            //}, 1000 / this._fps);
        }

        // virtual members
        Initialize() {
            // TODO initialize GameComponent members
            while (this._initializedComponents.length > 0)
            {
                this._initializedComponents[0].Initialize();
                this._initializedComponents.splice(0, 1);   // remove the first element
            }
            this.LoadContent();
        }

        LoadContent() { }

        Update(gameTime: GameTime) {
            // TODO call all GameComponent Update()
            for (var i = 0; i < this._updateableComponents.length; i++)
            {
                var updateable: IUpdateable = this._updateableComponents[i];
                if (updateable.getEnabled()) { // if it's enabled
                    updateable.Update(gameTime);
                }
            }
        }

        Draw(gameTime: GameTime) {
            // TODO call all GameComponent Draw()
            for (var i = 0; i < this._drawableComponents.length; i++)
            {
                var drawable: IDrawable = this._drawableComponents[i];
                if (drawable.getVisible()) {
                    drawable.Draw(gameTime);
                }
            }
        }

        public GameComponentAdded(gameComponent: IGameComponent): void {
            if (gameComponent == null)
                return;
            this._initializedComponents.push(gameComponent);
            // Get component type (updateable or drawable)
            if (gameComponent instanceof DrawableGameComponent) {
                this._updateableComponents.push(<GameComponent>gameComponent);
                this._drawableComponents.push(<DrawableGameComponent>gameComponent);
            }
            else {
                this._updateableComponents.push(<GameComponent>gameComponent);
            }
        }

        public GameComponentRemoved(gameComponent: IGameComponent): void {
            if (gameComponent == null)
                return;
            var index = this._initializedComponents.indexOf(gameComponent);
            this._initializedComponents.splice(index > -1 ? index : this._initializedComponents.length + 1, 1);
            if (gameComponent instanceof DrawableGameComponent) {
                index = this._drawableComponents.indexOf(<DrawableGameComponent>gameComponent);
                this._drawableComponents.splice(index > -1 ? index : this._drawableComponents.length + 1, 1);
                // remove from update too
                index = this._updateableComponents.indexOf(<GameComponent>gameComponent);
                this._updateableComponents.splice(index > -1 ? index : this._updateableComponents.length + 1, 1);
            }
            else {
                index = this._updateableComponents.indexOf(<GameComponent>gameComponent);
                this._updateableComponents.splice(index > -1 ? index : this._updateableComponents.length + 1, 1);
            }
        }

        // Properties
        get Services(): GameService { return this._gameServices; }
        get Components(): GameComponentArray { return this._gameComponents; }
        get Content(): ContentManager { return this._content; }

        get Fps(): number { return this._fps; }
        set Fps(fps: number) { if (this._fps != fps) this._fps = fps; }
    }
}