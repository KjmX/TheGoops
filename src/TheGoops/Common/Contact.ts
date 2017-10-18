///<reference path="../Interfaces/IContact.ts"/>

class Contact implements IContact {
    private _listener;

    constructor() {
        //this._listener = this.addContactListener();
        this._listener = new Box2D.Dynamics.b2ContactListener;
    }

   /* private addContactListener() {
        var listener: Box2D.Dynamics.b2ContactListener;
        return listener = new Box2D.Dynamics.b2ContactListener;
    }*/


    private BeginContact(listener) {
        listener.BeginContact = function (contact) {
            //         callbacks.BeginContact(contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody());
            var body1 = contact.GetFixtureA().GetBody();
            var body2 = contact.GetFixtureB().GetBody();
            if (body1.GetUserData().ref == undefined || body2.GetUserData().ref == undefined) {
                return;
            }
            body1.GetUserData().ref.onContact(body2.GetUserData(),undefined,'BEGIN');
            body2.GetUserData().ref.onContact(body1.GetUserData(), undefined,'BEGIN');
        }
    }

    private EndContact(listener) {
        listener.EndContact = function (contact) {
            //         callbacks.EndContact(contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody());
            var body1 = contact.GetFixtureA().GetBody();
            var body2 = contact.GetFixtureB().GetBody();
            if (body1.GetUserData().ref == undefined || body2.GetUserData().ref == undefined) {
                return;
            }
            body1.GetUserData().ref.onContact(body2.GetUserData(), undefined,'END');
            body2.GetUserData().ref.onContact(body1.GetUserData(), undefined,'END');
        }

    }
   
    private PostSolve(listener) {
        listener.PostSolve = function (contact: Box2D.Dynamics.Contacts.b2Contact, impulse) {
            // callBacks.PostSolve(contact.GetFixtureA().GetBody(), contact.GetFixtureB().GetBody(), impulse.normalImpulses[0]);
            var body1 = contact.GetFixtureA().GetBody();
            var body2 = contact.GetFixtureB().GetBody();
            if (body1.GetUserData().ref == undefined || body2.GetUserData().ref == undefined) {
                return;
            }

            var count = contact.GetManifold().m_pointCount;
            var maxImpulse = 0;
            for (var i = 0; i < count; ++i) {
                maxImpulse = Math.max(maxImpulse, impulse.normalImpulses[i]);
            }

            body1.GetUserData().ref.onContact(body2.GetUserData(), maxImpulse, 'POST');
            body2.GetUserData().ref.onContact(body1.GetUserData(), maxImpulse, 'POST');
        }
    }


    public startContactListener(wolrd: Box2D.Dynamics.b2World): void {

        this.BeginContact(this._listener);
        this.EndContact(this._listener);
        this.PostSolve(this._listener);

        wolrd.SetContactListener(this._listener);
    }

    public get Listener() { return this._listener; }
}