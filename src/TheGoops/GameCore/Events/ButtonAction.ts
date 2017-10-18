// This Event is published when a button was clicked
///<reference path="../Controls/Button.ts"/>

class ButtonAction {

    public button: Button;

    constructor(btn: Button) {
        this.button = btn;
    }
}