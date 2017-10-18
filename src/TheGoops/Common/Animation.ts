///<reference path="../Framework/GameComponent.ts"/>
///<reference path="../Interfaces/IAnimation.ts"/>

class Animation extends Core.GameComponent implements IAnimation {

    private _nf: number;
    private _x: number;
    private _y: number;
    private _iw: number;
    private _ih: number;
    private _fw: number;
    private _fh: number;
    private _index: number;
    private _speed: number;
    private _firstUpdate: bool;
    private _totalTime: number; // need for the animation speed
    private _customize: number[];
    private _nfw: number;
    private _nfh: number;
    private _playNumber: number;

    constructor(game: Core.Game) {
        super(game);
        this._firstUpdate = true;
        this._totalTime = 0;
        this._playNumber = 0;
    }

    Update(gameTime: Core.GameTime) {
        if (!this._firstUpdate) {
            this._totalTime += gameTime.ElapsedGameTime;
            if (this._totalTime > (1 / this._speed)) {
                if (this._customize != undefined && this._customize.length == 0) {
                    this._x += this._fw;
                    this._index++;
                    if (this._index >= this._nf) {
                        this._x = 0;
                        this._y = 0;
                        this._index = 0;
                        this._playNumber++;
                    } else if ((this._x + this._nf) > this._iw) {
                        this._x = 0;
                        this._y += this._fh;
                    }
                } else {
                    this.customizeUpdate();
                }
                this._totalTime = 0;
            }
        } else {
            this._firstUpdate = false;
        }
    }

    /*
    * This method is for customize animation like [1, 5, 2, 8]
    */
    private customizeUpdate(): void {
        this._x = Math.floor(Math.max(0, this._customize[this._index] - 1) % this._nfw) * this._fw;
        this._y = Math.floor(Math.max(0, this._customize[this._index] - 1) / this._nfw) * this._fh;
        this._index++;
        if (this._index == this._customize.length) {
            this._index = 0;
            this._playNumber++;
        }
    }

    public setCustomizeFrames(frames: number[]): void {
        this._customize = frames;
        this._index = 0;
        this._playNumber = 0;
    }

    public setAnimation(ax: number, ay: number, imgWidth: number, imgHeight: number, frameNumber: number, frameWidth: number, frameHeight: number, frameIndex: number, frameSpeed: number, customize?: number[]): void {
        this._x = ax;
        this._y = ay;
        this._iw = imgWidth;
        this._ih = imgHeight;
        this._nf = frameNumber;
        this._fw = frameWidth;
        this._fh = frameHeight;
        this._index = frameIndex;
        this._speed = frameSpeed;
        this._nfw = this._iw / this._fw;
        this._nfh = this._ih / this._fh;
        this._customize = customize;
        if (this._customize.length > 0) {
            this.customizeUpdate();
        }
    }

    public getCurrentFrame(): any {
        return {
            x: this._x,
            y: this._y,
            frameWidth: this._fw,
            frameHeight: this._fh
        };
    }

    public get PlayNumber() { return this._playNumber; }
}