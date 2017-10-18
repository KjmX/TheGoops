///<reference path="IGameComponent.ts"/>
///<reference path="IUpdateable.ts"/>


// Base class for all game components !
module Core {
    export class GameComponent implements IGameComponent, IUpdateable {
        private enabled: bool;
        private game: Game;

        constructor(game: Game) {
            this.enabled = true;
            this.game = game;
        }

        Initialize(): void { }

        Update(gameTime: GameTime): void { }

        getEnabled(): bool { return this.enabled; }
        setEnabled(value: bool) { if (this.enabled != value) this.enabled = value; }
        get Game(): Game { return this.game; }
    }
}