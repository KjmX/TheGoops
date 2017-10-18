interface IAnimation {
    setAnimation(ax: number, ay: number, imgWidth: number, imgHeight: number, frameNumber: number, frameWidth: number, frameHeight: number, frameIndex: number, frameSpeed: number): void;
    getCurrentFrame(): any;
    setCustomizeFrames(frames: number[]): void;
}