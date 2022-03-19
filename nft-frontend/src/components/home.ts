import { IRouteViewModel, Params } from "aurelia";

export class Home implements IRouteViewModel {
    // async load(params: Params) {
        
    // }

    clickScroll(id:string){
        const element = document.getElementById(id);
        console.log(element)
        scrollTo(0, element.offsetTop);
      }
}