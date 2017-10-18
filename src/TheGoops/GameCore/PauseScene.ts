///<reference path="GameScene.ts"/>
///<reference path="MenuComponent.ts"/>
///<reference path="../Element/Entity.ts"/>

enum ActionScenePauseList {
    RESUME,
    REPLAY,
    MAINMENU
}

class PauseScene extends GameScene implements IListener {

    private _cvs: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;
    private _game: Core.Game;
    private _background: Entity;
    private _physics: Physics;
    private _btnPlay: Button;
    private _btnReplay: Button;
    private _btnMainMenu: Button;
    private _selectedItem: number;

    constructor(game: Core.Game) {
        super(game);

        this._cvs = game.Services.GetService("HTMLCanvasElement");
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");
        this._game = game;
        this._physics = Physics.getInstance();
        this._selectedItem = -1;
        EventAggregator.getInstance().Subscribe(this, ButtonAction);

        this._background = new Entity(game, { "LeftMenuBackground": { img: game.Content.loadImage("inGamePauseMenu.png"), animation: false } }, new Box2D.Common.Math.b2Vec2((175 / 2) / this._physics.Scale, 8), 0, "LeftMenuBackgroud");
        this._background.setTexture("LeftMenuBackground");

        // buttons
        this._btnPlay = new Button(game.Content.loadImage("playBtn.png"), 75, 120, 80, 80);
        this._btnReplay = new Button(game.Content.loadImage("replayBtn.png"), 75, 220, 80, 80);
        this._btnMainMenu = new Button(game.Content.loadImage("backBtn.png"), 75, 320, 80, 80);
    }

    Update(gameTime: Core.GameTime) {

        this._btnPlay.Update(gameTime);

        this._btnReplay.Update(gameTime);

        this._btnMainMenu.Update(gameTime);
        
        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        
        this._ctx.save();

        this._ctx.fillStyle = "rgba(0, 0, 0, 0.2)";

        this._ctx.fillRect(0, 0, this._cvs.width, this._cvs.height);

        this._background.draw(this._ctx);

        this._btnPlay.Draw(this._ctx, gameTime);

        this._btnReplay.Draw(this._ctx, gameTime);

        this._btnMainMenu.Draw(this._ctx, gameTime);

        this._ctx.restore();

        super.Draw(gameTime);
    }

    Show() {
        this._selectedItem = -1;
        super.Show();
    }

    Hide() {
        this._selectedItem = -1;
        super.Hide();
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof ButtonAction) {
            if ((<ButtonAction>sub).button == this._btnPlay) {
                this._selectedItem = ActionScenePauseList.RESUME;
            } else if ((<ButtonAction>sub).button == this._btnReplay) {
                this._selectedItem = ActionScenePauseList.REPLAY;
            } else if ((<ButtonAction>sub).button == this._btnMainMenu) {
                this._selectedItem = ActionScenePauseList.MAINMENU;
            }
        }
    }

    public get SelectedItem() { return this._selectedItem; }
}