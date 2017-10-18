//Defines an interface for a game component that should be updated in Game.Update
///<reference path="Game.ts"/>

interface IUpdateable {
    Update(gameTime: Core.GameTime): void;

    getEnabled(): bool;
    setEnabled(bool): void;
}