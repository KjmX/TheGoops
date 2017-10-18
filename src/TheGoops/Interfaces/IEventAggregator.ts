interface IEventAggregator {
    Subscribe(obs: IListener, e: any): bool;
    UnSubscribe(obs: IListener, e?: any): bool;
    Publish(event: any, message?: any): void;
}