declare var jsonList: string;
module Core {
    /*
    * This class handle all assets loading, it retrieve assets from JSON file
    */
    export class Loader {
        private _loadedAssets;
        private _jsonPath: string;
        private _rootDir: string;
        private _json;
        private _callback;
        private _game;
        private _jFiles: any[];
        

        // loading screen part
        private _cnv: HTMLCanvasElement;
        private _ctx: CanvasRenderingContext2D;

        constructor(game: Game) {
            this._loadedAssets = {};
            this._jsonPath = "Content/assets.json";
            this._rootDir = "Content/";
            this._game = game;
            this._jFiles = [];

            //set the canvas
            this._cnv = <HTMLCanvasElement>document.createElement("canvas");
            this._cnv.width = 640;
            this._cnv.height = 480;
            document.body.appendChild(this._cnv);
            this._ctx = this._cnv.getContext("2d");
        }
        
        public loadAssets(callback) {
            this.setLoadingScreen();
            // first we must load the json file
            this._callback = callback.bind(this._game);
            this._loadJSONLocal();
        }

        private _loadJSON() {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', this._jsonPath, true);
            xhr.addEventListener('load', (e) => {
                if (xhr.status == 200) {
                    this._json = JSON.parse(xhr.responseText);
                    this._loadAllAssets();  // call the function that load all assets from json file
                } else {
                    throw "Unable to load manifest.";
                }
            });
            xhr.send();
        }

        private _loadJSONLocal() {
            
            var fileref = document.createElement('script');
            fileref.setAttribute("type", "text/javascript");
            fileref.onload = (e) => {
                console.log(jsonList);
                //this._json = JSON.parse(jsonList);
                this._json = jsonList;
                this._loadAllAssets();
            };
            fileref.setAttribute("src", this._jsonPath);
            document.getElementsByTagName("head")[0].appendChild(fileref);
        }

        private _loadAllAssets() {
            var assetsLen = this._json.length;
            var loadBatch = {
                count: 0,
                total: assetsLen
            };

            for (var i = 0; i < this._json.length; i++) {
                if (this._loadedAssets[this._json[i]] == null) {
                    var assetType = this.getAssetTypeFromExtension(this._json[i]);

                    if (assetType == 0) { // image file
                        var img = new Image();
                        img.onload = () => {
                            this.onLoadCallback(loadBatch);
                        }
                        img.src = this._rootDir + this._json[i];
                        this._loadedAssets[this._json[i]] = img;
                    } else if ((assetType == 1) && (this.getBrowserName() !== "Firefox")) {
                        var sound = new Audio();
                        sound.oncanplaythrough = () => {
                            loadBatch.count++;
                            this.onLoadCallback(loadBatch);
                        }
                        sound.src = this._rootDir + this._json[i];
                        this._loadedAssets[this._json[i]] = sound;
                    }
                    else if ((assetType == 3) && (this.getBrowserName() === "Firefox")) {
                        var sound = new Audio();
                        sound.oncanplaythrough = () => {
                            loadBatch.count++;
                            this.onLoadCallback(loadBatch);
                        }
                        sound.src = this._rootDir + this._json[i];
                        this._loadedAssets[this._json[i]] = sound;
                    } else if (assetType == 2) {
                        /*var xhr = new XMLHttpRequest();
                        xhr.open('GET', 'http://localhost/' + this._rootDir + this._json[i]);
                        xhr.onload = (e) => {
                            if (xhr.status == 200) {
                                this._loadedAssets[index] = JSON.parse(xhr.responseText);
                                this.onLoadCallback(loadBatch);
                            }
                        };
                        xhr.send();
                        var index = this._json[i];*/
                        this.loadFile('http://localhost/' + this._rootDir + this._json[i], loadBatch, this._json[i]);
                    }
                } else {
                    this.onLoadCallback(loadBatch);
                }
            }
        }

        private onLoadCallback(batch) {
            batch.count++;
            if (batch.count == batch.total) {
                this.endLoadingScreen();
                this._callback(this._loadedAssets);
            }
        }

        /*private getAssetTypeFromExtension(fname): number {
            if (fname.indexOf('.jpg') != -1 || fname.indexOf('.jpeg') != -1 || fname.indexOf('.png') != -1 || fname.indexOf('.gif') != -1) {
                // It's an image!
                return 0;
            } else if (fname.indexOf('.mp3') != -1 || fname.indexOf('.ogg') != -1) {
                // It's an audio!
                return 1;
            } else if (fname.indexOf('.js') != -1 || fname.indexOf('.json') != -1) {
                // It's a script file or json file
                return 2;
            }

            // Uh Oh
            return -1;
        }*/
        private getAssetTypeFromExtension(fname): number {
            if (fname.indexOf('.jpg') != -1 || fname.indexOf('.jpeg') != -1 || fname.indexOf('.png') != -1 || fname.indexOf('.gif') != -1) {
                // It's an image!
                return 0;
            }// else if (fname.indexOf('.mp3') != -1 || fname.indexOf('.ogg') != -1) {
            else if (fname.indexOf('.mp3') != -1) {
                // It's an audio!
                return 1;
            } else if (fname.indexOf('.js') != -1 || fname.indexOf('.json') != -1) {
                // It's a script file or json file
                return 2;
            }
            else if (fname.indexOf('.ogg') != -1) {
                return 3;
            }

            // Uh Oh
            return -1;
        }

        private loadFile(path: string, batch: any, index: any) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', path);
            xhr.onload = (e) => {
                if (xhr.status == 200) {
                    this._loadedAssets[index] = JSON.parse(xhr.responseText);
                    this.onLoadCallback(batch);
                }
            };
            xhr.send();
        }

        private setLoadingScreen() {
            this._ctx.clearRect(0, 0, this._cnv.width, this._cnv.height);
            this._ctx.fillText("Loading...", this._cnv.width / 2, this._cnv.height / 2);
        }

        private endLoadingScreen() {
            document.body.removeChild(this._cnv);
            this._ctx = null;
        }

        private getBrowserName(): String {
            if (navigator.userAgent.indexOf("Firefox") != -1) return "Firefox";
            else return "default";

        }
    }
}