///<reference path="../Interfaces/IBody.ts"/>
///<reference path="../Framework/DrawableGameComponent.ts"/>
///<reference path="Entity.ts"/>
///<reference path="../GameCore/EventAggregator.ts"/>
///<reference path="../GameCore/Events/CellDispose.ts"/>

class Cell extends Core.DrawableGameComponent implements IBody {

    public entity: Entity;
    public body: Box2D.Dynamics.b2Body;
    public name: string;
    public textureName: any;
    public frames: any;
    public game: Core.Game;
    public markAsDead: bool;
    public markAsInvisible: bool;

    constructor(game: Core.Game) {
        this.game == game;
        this.markAsDead = false;
        this.markAsInvisible = false;
        super(game);
    }

    Initialize(): void {
        super.Initialize();
    }

    LoadContent(): void { }

    Update(gameTime: Core.GameTime) {
        if (this.markAsDead) {
            this.Dispose();
        }
        if (this.markAsInvisible) {
            this.HideEntity();
        }
        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime) {
        super.Draw(gameTime);
    }

    Dispose(): void {
        // TODO: will see about this
        //this.game.Components.Remove(this);
        EventAggregator.getInstance().Publish(new CellDispose(this));
        this.HideEntity();
    }

    HideEntity() {
        if (this.entity != null) {
            //this.game.Components.Remove(this.entity.Animation);
            delete this.entity;
        }
        if (this.body != null) {
            Physics.getInstance().World.DestroyBody(this.body);
        }
    }

    onContact(target: any, impulse: number, method: string): void { }

    public get Body(): Box2D.Dynamics.b2Body { return this.body; }
    public get Name(): string { return null; }
}