///<reference path="../PopupDialog.ts"/>

class HidePopup {
    private _popup: PopupDialog;

    constructor(popup: PopupDialog) {
        this._popup = popup;
    }

    public get PopupDialog() { return this._popup; }
}