enum SceneName {
    MAINMENU,
    ACTION,
    PACKLVL
}

class PlayScene {

    private _scene: SceneName;

    constructor(scene: SceneName) {
        this._scene = scene;
    }

    public get Scene() { return this._scene; }
}