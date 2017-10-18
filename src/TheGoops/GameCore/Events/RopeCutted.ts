///<reference path="../../Adventure/Objects/Rope.ts"/>

class RopeCutted {

    private _rope: Rope;

    constructor(rope: Rope) {
        this._rope = rope;
    }

    public get Rope() { return this._rope; }
}