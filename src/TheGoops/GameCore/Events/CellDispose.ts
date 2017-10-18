// This Event is published when a cell need to remove itself from Component list
///<reference path="../../Element/Cell.ts"/>

class CellDispose {

    private _cell: Cell;

    constructor(cell: Cell) {
        this._cell = cell;
    }

    public get Cell() { return this._cell; }
}