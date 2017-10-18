module Input {
    export class KeyboardState {
        private _keyState: bool[];

        constructor(keyState: bool[]) {
            this._keyState = keyState;
        }

        public IsKeyDown(key: number): bool {
            return (this._keyState[key] == true);
        }

        public IsKeyUp(key: number): bool {
            return (this._keyState[key] == false);
        }

        public GetPressedKeys(): number[]{
            var pressedKeys: number[] = [];
            for (var i = 0; i < this._keyState.length; i++) {
                if (this._keyState[i]) {
                    pressedKeys.push(i);
                }
            }
            return pressedKeys;
        }

        public Clone() {
            return new KeyboardState(this._keyState);
        }
    }
}