///<reference path="GameScene.ts"/>
///<reference path="../Interfaces/IListener.ts"/>
///<reference path="Events/ShowPopup.ts"/>
///<reference path="Events/HidePopup.ts"/>

class PopupScene extends GameScene implements IListener {

    private _popupIsWaiting: bool;
    private _popup: PopupDialog;
    private _ea: EventAggregator;

    constructor(game: Core.Game) {
        super(game);

        this._popupIsWaiting = false;
        this._popup = null;
        this._ea = EventAggregator.getInstance();
        this._ea.Subscribe(this, ShowPopup);
        this._ea.Subscribe(this, HidePopup);
    }

    Update(gameTime: Core.GameTime) {
        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        super.Draw(gameTime);
    }

    Show() {
        super.Show();
    }

    Hide() {
        super.Hide();
    }

    EventNotify(sub: any, message?: any): void {
        if (sub instanceof ShowPopup) {
            this._popupIsWaiting = true;
            this._popup = (<ShowPopup>sub).PopupDialog;
            this._popup.Show();
            this.Components.push(this._popup);
        } else if (sub instanceof HidePopup) {
            this._popupIsWaiting = false;
            this._popup = (<HidePopup>sub).PopupDialog;
            this._popup.Hide();
            this.Components.splice(this.Components.indexOf(this._popup), 1);
            delete this._popup;
        }
    }

    public get PopupIsWaiting() { return this._popupIsWaiting; }
    public get Popup() { return this._popup; }
}