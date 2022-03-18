import { inject, route } from "aurelia";

import { Chain } from "./services/chain";

@route({
  routes: [
    { path: ["", "home"], component: import("./components/home"), title: "Home"},
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
  
}
