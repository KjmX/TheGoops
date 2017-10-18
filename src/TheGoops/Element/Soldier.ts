///<reference path="Enemy.ts"/>

class Soldier extends Enemy {

    private move(gameTime: Core.GameTime) {
        //var force = new Box2D.Common.Math.b2Vec2(2, this.body.GetMass() * -(<Box2D.Dynamics.b2World>this.Game.Services.GetService("b2World")).GetGravity().y);
        this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(2, 0), this.body.GetWorldCenter());
    }

    Update(gameTime: Core.GameTime) {
        this.move(gameTime);
        super.Update(gameTime);
    }

    onContact(target: any, impulse: number, method: string): void {
        if (method == "BEGIN") {
            var ref = <Cell>target.ref;
            if (ref instanceof Player) {
                this.markAsDead = true;
                (<Player>ref).GameOver = true;
            } else if (ref.Body.GetLinearVelocity().x > 0.5 || ref.Body.GetLinearVelocity().x < -0.5
                || ref.Body.GetLinearVelocity().y > 0.5 || ref.Body.GetLinearVelocity().y < -0.5) {
                this.markAsDead = true;
                ref.markAsDead = true;
            } else {
                this.body.SetLinearVelocity(new Box2D.Common.Math.b2Vec2(-2, 0));
            }
        }

        super.onContact(target, impulse, method);
    }
}