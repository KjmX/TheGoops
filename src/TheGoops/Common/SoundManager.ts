
class SoundManager {

    private static _soundArray: HTMLAudioElement[];

    constructor() {
        throw new Error("You can't add new instance of this class!");
    }

    public static playSound(sound: HTMLAudioElement): void {
        if (this._soundArray == undefined) this._soundArray = [];
        var test = false;
        console.log("houd");
        for (var i = 0; i < this._soundArray.length; i++) {
            if (this._soundArray[i] === sound) test = true;
        }

        if (!test) this._soundArray.push(sound);
        sound.play();
    }

    public static mute() {
        for (var i = 0; i < this._soundArray.length; i++) {
            this._soundArray[i].volume = 0;
        }
    }
    public static unMute() {
        for (var i = 0; i < this._soundArray.length; i++) {
            this._soundArray[i].volume = 1;
        }
    }

    public static pause() {
        for (var i = 0; i < this._soundArray.length; i++) {
            this._soundArray[i].pause();
        }
    }

    public static pauseMusic(music: HTMLAudioElement) {
        for (var i = 0; i < this._soundArray.length; i++) {
            if (this._soundArray[i] === music) this._soundArray[i].pause();
        }
    }

    /* public static stopMusic(sound: HTMLAudioElement) {
         for (var i = 0; i < this._soundArray.length; i++) {
             if (sound === this._soundArray[i]) { this._soundArray[i].pause(); }
         }
     }*/
    public static Resume() {
        for (var i = 0; i < this._soundArray.length; i++) {
            this._soundArray[i].resume();// to confirm
        }
    }




}