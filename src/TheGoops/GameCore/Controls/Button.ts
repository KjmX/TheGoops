///<reference path="../../Framework/Game.ts"/>
///<reference path="../../Framework/Input/Mouse.ts"/>
///<reference path="../../Framework/Input/MouseState.ts"/>
///<reference path="../EventAggregator.ts"/>
///<reference path="../Events/ButtonAction.ts"/>

class Button {

    private _buttonImage: HTMLImageElement;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _bWidth: number;
    private _bHeight: number;
    private _currMouseState: Input.MouseState;
    private _oldMouseState: Input.MouseState;
    private _hover: bool;
    private _hasHover: bool;
    private _clicked: bool;
    private _ea: EventAggregator;

    constructor(image: HTMLImageElement, x: number, y: number, bw?: number, bh?: number) {
        this._buttonImage = image;
        this._x = x;
        this._y = y;
        this._width = this._buttonImage.width;
        this._height = this._buttonImage.height;
        if (bw != undefined && bh != undefined) {
            this._bWidth = bw;
            this._bHeight = bh;
            this._hasHover = true;
        } else {
            this._bWidth = 0;
            this._bHeight = 0;
            this._hasHover = false;
        }
        this._oldMouseState = Input.Mouse.GetState();
        this._hover = false;
        this._clicked = false;
        this._ea = EventAggregator.getInstance();
    }

    Update(gameTime: Core.GameTime) {
        this._currMouseState = Input.Mouse.GetState();
        this._hover = false;
        this._clicked = false;
        if (this._hasHover) {
            var xStart = this._x - this._bWidth / 2;
            var xEnd = this._x + this._bWidth / 2;
            var yStart = this._y - this._bHeight / 2;
            var yEnd = this._y + this._bHeight / 2;
        } else {
            var xStart = this._x;
            var xEnd = this._x + this._width;
            var yStart = this._y;
            var yEnd = this._y + this._height;
        }
        if (this._currMouseState.X > xStart && this._currMouseState.X < xEnd
                    && this._currMouseState.Y > yStart && this._currMouseState.Y < yEnd) {
            //Start here
            this._hover = true;
            if (!this._currMouseState.LeftButton && this._oldMouseState.LeftButton) {
                this._clicked = true;
                //send an event to inform the clicking
                this._ea.Publish(new ButtonAction(this));
            }
        }
        this._oldMouseState = this._currMouseState;
    }

    Draw(ctx: CanvasRenderingContext2D, gameTime: Core.GameTime) {
        if (this._buttonImage == null) {
            return;
        }
        if (this._hasHover) {
            ctx.save();
            ctx.translate(this._x, this._y);
            if (this._hover) {
                ctx.drawImage(this._buttonImage, 0, 0, this._bWidth, this._bHeight, -(this._bWidth) / 2, -(this._bHeight) / 2, this._bWidth, this._bHeight);
            } else {
                ctx.drawImage(this._buttonImage, this._bWidth, 0, this._bWidth, this._bHeight, -(this._bWidth) / 2, -(this._bHeight) / 2, this._bWidth, this._bHeight);
            }
            ctx.restore();
        } else {
            ctx.drawImage(this._buttonImage, this._x, this._y);
        }
    }

    Dispose() { }

    public get Position() { return { x: this._x, y: this._y }; }
    public set Position(value: { x: number; y: number; }) { this._x = value.x; this._y = value.y; }

    public get Width() { return this._width; }
    public get Height() { return this._height; }
}