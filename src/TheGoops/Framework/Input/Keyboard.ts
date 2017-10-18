///<reference path="KeyboardState.ts"/>

module Input {
    export class Keyboard {
        private _keyState: bool[] = [];
        private _isEventStart: bool;

        constructor() {
            throw new Error("You can't add new instance of this class!");
        }

        public static addKeyboardEvents(): void {
            if (this._isEventStart) {
                return;
            }

            this._keyState = [];
            this._isEventStart = true;

            document.addEventListener("keydown", (e) => {
                this._keyState[(<KeyboardEvent>e).keyCode] = true;
            });
            document.addEventListener("keyup", (e) => {
                this._keyState[(<KeyboardEvent>e).keyCode] = false;
            });
        }

        public static GetState(): KeyboardState {
            if (!this._isEventStart) {
                return null;
            } else {
                return new KeyboardState(this._keyState);
            }
        }
    }
}