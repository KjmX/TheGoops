///<reference path="../PopupDialog.ts"/>
///<reference path="../../Interfaces/IListener.ts"/>
///<reference path="../Events/PlayScene.ts"/>

class GameOverPopup extends PopupDialog implements IListener {

    private _replayBtn: Button;
    private _closeBtn: Button;
    private _gameScene: any;
    private _game: Core.Game;

    constructor(game: Core.Game, gameScene: any) {
        super(game);

        this.Background = new Entity(game, { "background": { img: game.Content.loadImage("popupGO.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(this._cvs.width / 2 / Physics.getInstance().Scale, this._cvs.height / 2 / Physics.getInstance().Scale), 0, "Background");
        this.Background.setTexture("background");
        this.Width = this.Background.Width;
        this.Height = this.Background.Height;
        this._game = game;
        this._gameScene = gameScene;
        this.addText("Game Over", 110, 40);
        this.addText("Your Score: " + (<Score>game.Services.GetService("Score")).Score, this.Width / 3 - 10, this.Height / 2 - 30);
        this._replayBtn = new Button(game.Content.loadImage("replayBtn.png"), 55, 300, 80, 80);
        this.addButton(this._replayBtn);

        this._closeBtn = new Button(game.Content.loadImage("backBtn.png"), 294, 300, 80, 80);
        this.addButton(this._closeBtn);

        this.ea.Subscribe(this, ButtonAction);

        this.NotifyShow();
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof ButtonAction) {
            if ((<ButtonAction>sub).button == this._replayBtn) {
                this.NotifyHide();
                this._gameScene.Replay();
            } else if ((<ButtonAction>sub).button == this._closeBtn) {
                this.NotifyHide();
                this.ea.Publish(new PlayScene(SceneName.MAINMENU));
                this._gameScene.Replay();
            }
        }
    }
}