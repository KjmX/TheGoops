module Core {
    export class GameTime {
        private _startTime: number;
        private _stopTime: number;
        private _totalGameTime: number;
        private _isRunning: bool;

        constructor() {
            this._totalGameTime = 0;
            this._isRunning = false;
        }

        public Start() {
            if (this._isRunning == true) {
                return;
            } else if (this._startTime != null) {
                this._stopTime = null;
            }

            this._isRunning = true;
            this._startTime = this.getTime();

            if (this._totalGameTime == null) {
                this._totalGameTime = this.getTime();
            }
        }

        public Stop(): void {
            if (this._isRunning == false) {
                return;
            }
            this._stopTime = this.getTime();
            this._isRunning = false;
        }

        public get ElapsedGameTime(): number {
            if (this._startTime == null)
                return 0;
            if (this._isRunning == true) {
                return (Date.now() - this._startTime) / 1000;
            } else {
                if (this._stopTime == null) {
                    return 0;
                } else {
                    return (this._stopTime - this._startTime) / 1000;
                }
            }
        }

        public get TotalGameTime(): number {
            return (Date.now() - this._totalGameTime) / 1000;
        }

        private getTime(): number {
            var time = new Date();
            return time.getTime();
        }
    }
}