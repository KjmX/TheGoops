///<reference path="../Interfaces/IEntity.ts"/>
///<reference path="../box2dweb-min.d.ts"/>
///<reference path="../Common/Physics.ts"/>
///<reference path="../Common/Animation.ts"/>

class Entity implements IEntity {

    private _position: Box2D.Common.Math.b2Vec2;

    public _currentTexture: any;

    private _angle: number;

    private _texture: { [name: string]: any; };

    private _name: string;

    private _game: Core.Game;

    private _animation: Animation;

    private _imageCrop: any;

    private _width: number;

    private _height: number;

    private _playNumber: number;

    constructor(game: Core.Game, texture: { [name: string]: any; }, position: Box2D.Common.Math.b2Vec2, angle: number, name: string, imageCrop?: any) {

        this._game = game;

        this._texture = texture;

        this._position = position;

        this._angle = angle;

        this._name = name;

        this._currentTexture = null;

        this._imageCrop = imageCrop;

        this._playNumber = 0;
    }

    update(gameTime: Core.GameTime, position: Box2D.Common.Math.b2Vec2, angle: number) {

        this._position = position;

        this._angle = angle;

        if (this._animation != null) {
            this._animation.Update(gameTime);
            this._playNumber = this._animation.PlayNumber;
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.translate(this._position.x * Physics.getInstance().Scale, this._position.y * Physics.getInstance().Scale);
        ctx.rotate(this._angle);

        if (this._currentTexture.animation) {
            var anData = this._animation.getCurrentFrame();
            ctx.drawImage(this._currentTexture.img, anData.x, anData.y, anData.frameWidth, anData.frameHeight, -(anData.frameWidth) / 2, -(anData.frameHeight) / 2, anData.frameWidth, anData.frameHeight);
        }
        else {
            if (this._imageCrop != undefined) {
                ctx.drawImage(this._currentTexture.img, this._imageCrop.x, this._imageCrop.y, this._imageCrop.w, this._imageCrop.h, -(this._imageCrop.w) / 2, -(this._imageCrop.h) / 2, this._imageCrop.w, this._imageCrop.h);
            } else {
                ctx.drawImage(this._currentTexture.img, -(<HTMLImageElement>this._currentTexture.img).width / 2, -(<HTMLImageElement>this._currentTexture.img).height / 2);
            }
        }

        ctx.restore();
    }

    setTexture(textureName: string) {

        if (this._texture[textureName] !== undefined) {
            this._currentTexture = this._texture[textureName];
            if (this._currentTexture.animation) {
                if (this._animation == null) {
                    this._animation = new Animation(this._game);
                    //this._game.Components.Add(this._animation);
                }
                this._animation.setAnimation(this._currentTexture.anmOption.ax,
                                 this._currentTexture.anmOption.ay,
                                 this._currentTexture.img.width,
                                 this._currentTexture.img.height,
                                 this._currentTexture.anmOption.frameNum,
                                 this._currentTexture.anmOption.frameW,
                                 this._currentTexture.anmOption.frameH,
                                 this._currentTexture.anmOption.frameI,
                                 this._currentTexture.anmOption.frameSpeed,
                                 this._currentTexture.anmOption.customize != undefined ? this._currentTexture.anmOption.customize : []);

                this._width = this._currentTexture.anmOption.frameW;
                this._height = this._currentTexture.anmOption.frameH;
            } else {
                this._width = this._currentTexture.img.width;
                this._height = this._currentTexture.img.height;
            }
        }
    }

    removeAnimationFromComponent() {
        if (this._animation != null) {
            this._game.Components.Remove(this._animation);
        }
    }

    public get Position(): Box2D.Common.Math.b2Vec2 { return this._position; }
    public get Angle(): number { return this._angle; }
    public get Texture(): { [name: string]: any; } { return this._texture; }
    public get Name(): string { return this._name; }
    public get Animation(): Animation { return this._animation; }
    public get Width(): number { return this._width; }
    public get Height(): number { return this._height; };
    public get PlayNumber(): number { return this._playNumber; }
}