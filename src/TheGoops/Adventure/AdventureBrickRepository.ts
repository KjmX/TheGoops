// it will get info from Objects.json, but since we don't have Glass in surv mode then we will change it later
///<reference path="../Framework/GameComponent.ts"/>

class AdventureBrickRepository {

    private _repository: any;
    private _brickTypes: any[];

    constructor(game: Core.Game) {
        this._repository = game.Content.loadFile("objects.json");
        if (this._repository != null) {
            this._repository = this._repository["lvl-1"];
        }

        this._brickTypes = [];
        this.addNewType("rock01.png", 2);
    }

    private addNewType(name: string, density: number) {
        this._brickTypes.push({ name: name, density: density });
    }

    public getBrickInfo(type: number): any {
        if (this._repository == null) {
            return null;
        }

        var id = -1;
        var bObj = null;
        for (var i = 0; i < this._brickTypes.length; i++) {
            if (type == i) {
                id = i;
                break;
            }
        }
        if (id > -1) {
            for (var i = 0; i < this._repository.length; i++) {
                if (this._repository[i].texture == this._brickTypes[id].name) {
                    bObj = this._repository[i];
                    bObj["density"] = this._brickTypes[id].density;
                    break;
                }
            }
        }
        return bObj;
    }
}