///<reference path="../Framework/DrawableGameComponent.ts"/>

class GameScene extends Core.DrawableGameComponent {
    private components: Core.GameComponent[];

    constructor(game: Core.Game) {
        super(game);
        this.components = [];
        this.setEnabled(false);
        this.setVisible(false);
    }

    public Show(): void {
        this.setEnabled(true);
        this.setVisible(true);
    }

    public Hide(): void {
        this.setEnabled(false);
        this.setVisible(false);
    }

    Update(gameTime: Core.GameTime) {
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i].getEnabled()) {
                this.components[i].Update(gameTime);
            }
        }
        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        for (var i = 0; i < this.components.length; i++) {
            if ((this.components[i] instanceof Core.DrawableGameComponent) &&
                (<Core.DrawableGameComponent>this.components[i]).getVisible())
            {
                (<Core.DrawableGameComponent>this.components[i]).Draw(gameTime);
            }
        }
        super.Draw(gameTime);
    }
    
    public get Components() { return this.components; }
}