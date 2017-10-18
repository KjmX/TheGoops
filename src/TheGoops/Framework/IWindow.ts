interface Window {
    requestAnimFrame(callback: any, element?: any): void;
    webkitRequestAnimationFrame(callback: any, element?: any): void;
    mozRequestAnimationFrame(callback: any, element?: any): void;
    oRequestAnimationFrame(callback: any, element?: any): void;
}