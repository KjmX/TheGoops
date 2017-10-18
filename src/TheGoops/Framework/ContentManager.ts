module Core {
    export class ContentManager {
        private _loadedAssets: { [name: string]: any; };
        private _srcList: string[];
        private _loaded: bool;
        private _rootDir: string;

        constructor() {
            this._loadedAssets = {};
            this._srcList = [];
            this._rootDir = "Content/";
        }

        public loadImage(img: string): HTMLImageElement {
            if (this._loadedAssets[img] != null) {
                return this._loadedAssets[img];
            }

            this._loaded = false;
            var imageContent = new Image();
            imageContent.onload = () => {
                this._loadedAssets[img] = imageContent;
                this._loaded = true;
                console.log(this._loaded);
            };
            imageContent.src = this._rootDir + img;

            //while (!this._loaded) { console.log("not Loaded"); }

            return imageContent;
        }

        public loadAudio(sound: string): HTMLAudioElement {
            if (this._loadedAssets[sound + ".mp3"] != null) {
                return this._loadedAssets[sound + ".mp3"];
            } else if (this._loadedAssets[sound + ".ogg"] != null) {
                return this._loadedAssets[sound + ".ogg"];
            }
            else {
                return null;
            }
        }

        public loadFile(filename: string): any {
            if (this._loadedAssets[filename] != null) {
                return this._loadedAssets[filename];
            } else {
                return null;
            }
        }

        public get Assets() { return this._loadedAssets; }
        public set Assets(value) { this._loadedAssets = value; }
    }
}