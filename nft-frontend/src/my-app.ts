import { inject, route } from "aurelia";

import { Chain } from "./services/chain";

@route({
  routes: [
    { path: ["", "home"], component: import("./components/home")},
    { path: "mint", component: import("./components/mint"), title: "Mint"}
  ]
})

@inject(Chain)
export class MyApp {
  constructor(
    public chain: Chain
  ) {}

  connect() {
    this.chain.connect();
  }
  
  
  clickScroll(id:string){
    const element = document.getElementById(id);
    scrollTo(0, element.offsetTop)
  }
}
