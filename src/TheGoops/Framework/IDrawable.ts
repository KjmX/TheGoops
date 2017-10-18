//Defines the interface for a drawable game component.
///<reference path="Game.ts"/>

interface IDrawable {
    Draw(gameTime: Core.GameTime): void;

    getVisible(): bool;
    setVisible(bool): void;
}