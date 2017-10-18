///<reference path="../Framework/DrawableGameComponent.ts"/>
///<reference path="../Element/Entity.ts"/>
///<reference path="Controls/Button.ts"/>
///<reference path="Events/ShowPopup.ts"/>
///<reference path="Events/HidePopup.ts"/>

class PopupDialog extends Core.DrawableGameComponent {

    public _cvs: HTMLCanvasElement;
    public _ctx: CanvasRenderingContext2D;
    private _backImg: HTMLImageElement;
    private _background: Entity;
    private _backgroundColor: string;
    private _width: number;
    private _height: number;
    private _buttonsArray: any[];
    private _textsArray: any[];
    private _imagesArray: Entity[];
    public ea: EventAggregator;
    public transparent: bool;

    constructor(game: Core.Game) {
        super(game);

        this._cvs = game.Services.GetService("HTMLCanvasElement");
        this._ctx = game.Services.GetService("CanvasRenderingContext2D");

        this._backImg = game.Content.loadImage("dialog.png");
        this._background = new Entity(game, { "background": { img: this._backImg, animation: false } }, new Box2D.Common.Math.b2Vec2(this._cvs.width / 2 / Physics.getInstance().Scale, this._cvs.height / 2 / Physics.getInstance().Scale), 0, "Background");
        this._background.setTexture("background");
        this._backgroundColor = "rgba(0, 0, 0, 0.2)";
        this._width = this._background.Width;
        this._height = this._background.Height;
        this.transparent = true;

        this._buttonsArray = [];
        this._textsArray = [];
        this._imagesArray = [];
        this.Hide();
        this.ea = EventAggregator.getInstance();
        
    }

    public addButton(button: Button): void {
        var rx = (this._background.Position.x * Physics.getInstance().Scale) - (this._background.Width / 2) + button.Position.x;
        var ry = (this._background.Position.y * Physics.getInstance().Scale) - (this._background.Height / 2) + button.Position.y;
        button.Position = { x: rx, y: ry };
        this._buttonsArray.push({ button: button });
    }

    public addText(text: string, x: number, y: number): void {
        var rx = (this._background.Position.x * Physics.getInstance().Scale) - (this._background.Width / 2) + x;
        var ry = (this._background.Position.y * Physics.getInstance().Scale) - (this._background.Height / 2) + y + 20;
        this._textsArray.push({text: text, x: rx, y: ry});
    }

    public addImage(image: Entity): void {
        this._imagesArray.push(image);
    }

    Update(gameTime: Core.GameTime): void {
        for (var i = 0; i < this._buttonsArray.length; i++) {
            (<Button>this._buttonsArray[i].button).Update(gameTime);
        }

        super.Update(gameTime);
    }

    Draw(gameTime: Core.GameTime): void {
        this._ctx.save();
        this._ctx.fillStyle = this._backgroundColor;
        this._ctx.fillRect(0, 0, this._cvs.width, this._cvs.height);
        //this._ctx.globalAlpha = 0.5;
        this._background.draw(this._ctx);
        this._ctx.restore();

        for (var i = 0; i < this._buttonsArray.length; i++) {
            (<Button>this._buttonsArray[i].button).Draw(this._ctx, gameTime);
        }

        for (var i = 0; i < this._textsArray.length; i++) {
            this._ctx.fillText(this._textsArray[i].text, this._textsArray[i].x, this._textsArray[i].y);
        }

        for (var i = 0; i < this._imagesArray.length; i++) {
            this._imagesArray[i].draw(this._ctx);
        }

        super.Draw(gameTime);
    }

    public Show() {
        this.setEnabled(true);
        this.setVisible(true);
    }

    public Hide() {
        this.setVisible(false);
        this.setEnabled(false);
    }

    public NotifyShow() {
        this.ea.Publish(new ShowPopup(this));
    }

    public NotifyHide() {
        this.ea.Publish(new HidePopup(this));
    }

    public get Background() { return this._background; }
    public set Background(value) { this._background = value; }
    public get Width() { return this._width; }
    public set Width(value) { this._width = value; }
    public get Height() { return this._height; }
    public set Height(value) { this._height = value; }
}