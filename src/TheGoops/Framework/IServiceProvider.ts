// Interface that have only GetService(), i think the name explan everything ;)
interface IServiceProvider {
    GetService(serviceType: string): any;  // return an Object
}