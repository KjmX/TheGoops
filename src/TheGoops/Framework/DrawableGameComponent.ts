// A game component that is notified when it needs to draw itself.
///<reference path="GameComponent.ts"/>
///<reference path="IDrawable.ts"/>

module Core {
    export class DrawableGameComponent extends GameComponent implements IDrawable {
        private initialized: bool;
        private visible: bool;

        constructor(game: Game) {
            super(game);
            this.visible = true;
        }

        Draw(gameTime: GameTime): void { }

        Initialize(): void {
            super.Initialize();
            if (!this.initialized)
            {
                this.LoadContent();
            }
            this.initialized = true;
        }

        LoadContent(): void { }

        getVisible(): bool { return this.visible; }
        setVisible(visible: bool): void { if(this.visible != visible) this.visible = visible; }
    }
}