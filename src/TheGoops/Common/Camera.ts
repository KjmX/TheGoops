///<reference path="../box2dweb-min.d.ts"/>

// singleton
class Camera {
    private static _instance: Camera;
    private _scale: number;
    private _canvasOffset: { x: number; y: number; } = { x: null, y: null };
    private _viewCenterPixel: { x: number; y: number; } = { x: null, y: null };
    private _canvas: HTMLCanvasElement;
    private _ctx: CanvasRenderingContext2D;

    public static getInstance(): Camera {
        if (this._instance == null) {
            this._instance = new Camera();
        }
        return this._instance;
    }

    public getWorldPointFromPixelPoint(x: number, y: number): { x: number; y: number; } {
        return {
            x: (x - this._canvasOffset.x) / this._scale,
            y: (y - (this._canvas.height - this._canvasOffset.y)) / this._scale
        };
    }

    public setViewCenterWorld(b2VecPos: Box2D.Common.Math.b2Vec2, instantaneous: number): void {
        var currentViewCenterWorld = this.getWorldPointFromPixelPoint(this._viewCenterPixel.x, this._viewCenterPixel.y);
        var toMoveX = b2VecPos.x - currentViewCenterWorld.x;
        var toMoveY = b2VecPos.y - currentViewCenterWorld.y;
        var fraction = instantaneous ? 1 : 0.25;
        this._canvasOffset.x -= this.camRound(fraction * toMoveX * this._scale, 0);
        this._canvasOffset.y += this.camRound(fraction * toMoveY * this._scale, 0);
    }

    public camRound(val: number, places: number): number {
        var c = 1;
        for (var i = 0; i < places; i++)
            c *= 10;
        return Math.round(val * c) / c;
    }

    // draw things
    public beginDraw(): void {
        if (this._ctx == null) {
            return;
        }

        this._ctx.save();
        this._ctx.translate(this._canvasOffset.x, this._canvasOffset.y);
        this._ctx.scale(this._scale, this._scale);
    }

    public endDraw(): void {
        if (this._ctx == null) {
            return;
        }

        this._ctx.restore();
    }

    /*
    * Some features
    */
    public up(distance: number): void {
        this._canvasOffset.y -= distance;
    }

    public down(distance: number): void {
        this._canvasOffset.y += distance;
    }

    public move(x: number, y: number): void {
        this._canvasOffset.x += x;
        this._canvasOffset.y += y;
    }

    public zoomIn(): void {
        var currentViewCenterWorld = this.getWorldPointFromPixelPoint(this._viewCenterPixel.x, this._viewCenterPixel.y);
        this._scale *= 1.1;
        var newViewCenterWorld = this.getWorldPointFromPixelPoint(this._viewCenterPixel.x, this._viewCenterPixel.y);
        this._canvasOffset.x += (newViewCenterWorld.x - currentViewCenterWorld.x) * this._scale;
        this._canvasOffset.y -= (newViewCenterWorld.y - currentViewCenterWorld.y) * this._scale;
    }

    public zoomOut(): void {
        var currentViewCenterWorld = this.getWorldPointFromPixelPoint(this._viewCenterPixel.x, this._viewCenterPixel.y);
        this._scale /= 1.1;
        var newViewCenterWorld = this.getWorldPointFromPixelPoint(this._viewCenterPixel.x, this._viewCenterPixel.y);
        this._canvasOffset.x += (newViewCenterWorld.x - currentViewCenterWorld.x) * this._scale;
        this._canvasOffset.y -= (newViewCenterWorld.y - currentViewCenterWorld.y) * this._scale;
    }

    /*
    * Properties
    */
    public get Scale() { return this._scale; }
    public set Scale(value: number) { this._scale = value; }

    public get CanvasOffset() { return this._canvasOffset; }
    public set CanvasOffset(value) { this._canvasOffset = value; }

    public get ViewCenterPixel() { return this._viewCenterPixel; }
    public set ViewCenterPixel(value) { this._viewCenterPixel = value; }

    public get Canvas() { return this._canvas; }
    public set Canvas(value: HTMLCanvasElement) { this._canvas = value; }

    public get Ctx() { return this._ctx; }
    public set Ctx(value: CanvasRenderingContext2D) { this._ctx = value; }
}