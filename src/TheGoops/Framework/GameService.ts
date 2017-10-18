///<reference path="IServiceProvider.ts"/>

module Core {
    export class GameService implements IServiceProvider {
        private services: { [type: string]: any; }; // well this is a c# Dictionary-Like (Dictionary<type, object>)

        constructor {
            this.services = {};
        }

        AddService(type: string, provider: any): void {
            if (type.length == 0)
            {
                console.log("Service Type cannot be null @AddService()");
                return;
            }
            if (provider == null)
            {
                console.log("Service Provider cannot be null @AddService()");
                return;
            }
            if (this.services[type] != null)
            {
                console.log("Service already exist @AddService()");
            }
            /*if (typeof (provider) != type)
            {
                console.log("Service Provider type is not the same as Service Type @AddService()");
                return;
            }*/
            // now we add the service to our list
            this.services[type] = provider;
        }

        GetService(type: string): any {
            if (type.length == 0)
            {
                console.log("Service Type cannot be null @GetService()");
                return;
            }
            if (this.services[type] != null)
            {
                return this.services[type];
            }
            return null;
        }

        RemoveService(type: string): void {
            if (type.length == 0) {
                console.log("Service Type cannot be null @RemoveService()");
                return;
            }
            if (this.services[type] != null)
            {
                this.services[type] = null;
            }
        }
    }
}