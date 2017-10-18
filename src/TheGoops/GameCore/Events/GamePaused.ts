// This even is for game pause

class GamePaused {

    private _value: bool;

    constructor(pause: bool) {
        this._value = pause;
    }

    public get Pause() { return this._value; }
}