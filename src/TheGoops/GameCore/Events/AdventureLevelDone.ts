///<reference path="../../Adventure/Objects/AdventurePlayer.ts"/>

class AdventureLevelDone {

    private _player: AdventurePlayer;

    constructor(player: AdventurePlayer) {
        this._player = player;
    }

    public get Player() { return this._player; }
}