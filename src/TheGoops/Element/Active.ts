///<reference path="../Interfaces/IActive.ts"/>
///<reference path="Cell.ts"/>

class Active extends Cell implements IActive {

    kill(): void {
        super.Dispose();
    }
}