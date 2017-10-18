///<reference path="../Interfaces/IEventAggregator.ts"/>
///<reference path="../Interfaces/IListener.ts"/>

class EventAggregator implements IEventAggregator {

    private static _instance: EventAggregator;
    private _observers: { Event: any; Observer: IListener; }[];

    public static getInstance(): EventAggregator {
        if (_instance == null) {
            _instance = new EventAggregator();
        }
        return _instance;
    }

    Publish(e: any, message?: any): void {
        for (var i = 0; i < this._observers.length; ++i) {
            if (e instanceof this._observers[i].Event) {
                this._observers[i].Observer.EventNotify(e, message);
            }
        }
    }

    Subscribe(obs: IListener, e: any): bool {
        if(this._observers == undefined) {
            this._observers = []
        }
        for (var i = 0; i < this._observers.length; i++) {
            if (this._observers[i].Observer === obs && this._observers[i].Event == e) {
                return false;
            }
        }

        this._observers.push({ Event: e, Observer: obs });
        return true;
    }
    
    UnSubscribe(obs: IListener, e?: any): bool {
        if (e != undefined) {
            for (var i = 0; i < this._observers.length; i++) {
                if (this._observers[i].Observer == obs && this._observers[i].Event == e) {
                    this._observers.splice(i, 1);
                    break;
                }
            }
        } else {
            for (var i = 0; i < this._observers.length; i++) {
                if (this._observers[i].Observer == obs) {
                    this._observers.splice(i, 1);
                }
            }
        }
        return true;
    }
}