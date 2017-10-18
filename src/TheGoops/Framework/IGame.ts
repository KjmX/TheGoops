interface IGame {
    Initialize(): void;
    LoadContent(): void;
    Update(GameTime): void; // TODO: add gametime as argument
    Draw(GameTime): void;   // TODO: add gametime as argument
}