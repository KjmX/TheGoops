///<reference path="MouseState.ts"/>

module Input {
    export class Mouse {

        private _isEventStart: bool;
        private _leftButton: bool;
        private _rightButton: bool;
        private _middleButton: bool;
        private _mouseX: number;
        private _mouseY: number;

        constructor() {
            throw new Error("You can't add new instance of this class!");
        }

        public static addMouseEvents(dom: HTMLCanvasElement): void {
            if (this._isEventStart) {
                return;
            }

            this._isEventStart = true;

            dom.addEventListener("mousedown", (e) => {
                if ((<MouseEvent>e).which == 1) {
                    this._leftButton = true;
                } else if ((<MouseEvent>e).which == 2) {
                    this._middleButton = true;
                } else if ((<MouseEvent>e).which == 3) {
                    this._rightButton = true;
                }
            });
            dom.addEventListener("mouseup", (e) => {
                if ((<MouseEvent>e).which == 1) {
                    this._leftButton = false;
                } else if ((<MouseEvent>e).which == 2) {
                    this._middleButton = false;
                } else if ((<MouseEvent>e).which == 3) {
                    this._rightButton = false;
                }
            });
            dom.addEventListener("mousemove", (e) => {
                this._mouseX = (<MouseEvent>e).clientX - dom.getBoundingClientRect().left;
                this._mouseY = (<MouseEvent>e).clientY - dom.getBoundingClientRect().top;
            });
        }

        public static GetState(): MouseState {
            if (!this._isEventStart) {
                return null;
            } else {
                return new MouseState(this._mouseX, this._mouseY, this._leftButton, this._middleButton, this._rightButton);
            }
        }

    }
}