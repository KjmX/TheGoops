module Input {
    export class MouseState {

        private _leftButton: bool;
        private _rightButton: bool;
        private _middleButton: bool;
        private _x: number;
        private _y: number;

        constructor(x: number, y: number, leftButton: bool, middleButton: bool, rightButton: bool) {
            this._x = x;
            this._y = y;
            this._leftButton = leftButton;
            this._middleButton = middleButton;
            this._rightButton = rightButton;
        }

        public get X(): number {
            return this._x;
        }

        public get Y(): number {
            return this._y;
        }

        public get LeftButton(): bool {
            return this._leftButton;
        }

        public get RightButton(): bool {
            return this._rightButton;
        }

        public get MiddleButton(): bool {
            return this._middleButton;
        }

    }
}