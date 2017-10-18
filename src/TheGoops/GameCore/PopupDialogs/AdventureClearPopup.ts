///<reference path="../PopupDialog.ts"/>
///<reference path="../../Interfaces/IListener.ts"/>
///<reference path="../Events/PlayScene.ts"/>

class AdventureClearPopup extends PopupDialog implements IListener {

    private _replayBtn: Button;
    private _lvlBtn: Button;
    private _nextBtn: Button;
    private _gameScene: any;
    private _game: Core.Game;
    private _clearEntity: Entity;

    constructor(game: Core.Game, gameScene: any, player: any) {
        super(game);

        this.Background = new Entity(game, { "background": { img: game.Content.loadImage("popupGO.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(this._cvs.width / 2 / Physics.getInstance().Scale, this._cvs.height / 2 / Physics.getInstance().Scale), 0, "Background");
        this.Background.setTexture("background");
        this.Width = this.Background.Width;
        this.Height = this.Background.Height;
        this._game = game;
        this._gameScene = gameScene;
        this._clearEntity = new Entity(game, { "Clear": { img: game.Content.loadImage("Clear.png"), animation: false } }, new Box2D.Common.Math.b2Vec2(this._cvs.width / 2 / Physics.getInstance().Scale, (this._cvs.height / 2 - 125) / Physics.getInstance().Scale), 0, "Clear");
        this._clearEntity.setTexture("Clear");
        this.addImage(this._clearEntity);
        this.addText("Your Score: " + player.Score, this.Width / 3 - 10, this.Height / 2 - 30);
        this._replayBtn = new Button(game.Content.loadImage("replayBtn.png"), 55, 300, 80, 80);
        this.addButton(this._replayBtn);
        this._nextBtn = new Button(game.Content.loadImage("nextBtn.png"), 175, 300, 80, 80);
        this.addButton(this._nextBtn);
        this._lvlBtn = new Button(game.Content.loadImage("lvlmenuBtn.png"), 294, 300, 80, 80);
        this.addButton(this._lvlBtn);

        this.ea.Subscribe(this, ButtonAction);

        this.NotifyShow();
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof ButtonAction) {
            if ((<ButtonAction>sub).button == this._replayBtn) {
                this.NotifyHide();
                this._gameScene.Replay();
            } else if ((<ButtonAction>sub).button == this._lvlBtn || (<ButtonAction>sub).button == this._nextBtn) {
                this.NotifyHide();
                this.ea.Publish(new PlayScene(SceneName.PACKLVL));
                this._gameScene.Replay(true);
            }
        }
    }
}