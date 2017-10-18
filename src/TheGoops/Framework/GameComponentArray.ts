// A collection of game components.
///<reference path="IGameComponent.ts"/>

module Core {
    export class GameComponentArray {
        private _components: IGameComponent[];
        //private _callbackAdded: (item: IGameComponent) => void;
        //private _callbackRemoved: (item: IGameComponent) => void;
        private _game: Game;

        constructor(game: Game) {
            this._components = [];
            //this._callbackAdded = callbackAdded;
            //this._callbackRemoved = callbackRemoved;
            this._game = game;
        }

        Add(item: IGameComponent): void {
            if (item != null) {
                this._components.push(item);
                this._game.GameComponentAdded(item);
            }
        }

        Remove(item: IGameComponent): void {
            for (var i = 0; i < this._components.length; i++) {
                if (this._components[i] == item) {
                    this._components.splice(i, 1);
                    this._game.GameComponentRemoved(item);
                    break;
                }
            }
        }

        get Components() { return this._components; }
    }
}