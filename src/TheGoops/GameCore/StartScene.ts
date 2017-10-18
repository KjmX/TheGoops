///<reference path="GameScene.ts"/>
///<reference path="MenuComponent.ts"/>
///<reference path="../Common/SoundManager.ts"/>

class StartScene extends GameScene {

    private _menu: MenuComponent;
    private _backGroundMusic: HTMLAudioElement;

    constructor(game: Core.Game) {
        super(game);

        this._menu = new MenuComponent(game);
        
        this._backGroundMusic = game.Content.loadAudio("backGroundMusic");

        this.Components.push(this._menu);
    }

    Update(gameTime: Core.GameTime) {
        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        super.Draw(gameTime);
    }

    Show() {
        SoundManager.playSound(this._backGroundMusic);
        this._backGroundMusic.loop = true;
        super.Show();
    }

    Hide() {
        SoundManager.pauseMusic(this._backGroundMusic);
        super.Hide();
    }

    public get SelectedMenuIndex() { return this._menu.SelectedItem; }
    public get Ready() { return this._menu.Ready; }
}