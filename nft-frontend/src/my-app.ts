import { inject, route } from "aurelia";

import { Chain } from "./services/chain";

@route({
  routes: [
    { path: "", component: import("./components/mint"), title: "Home"},
    { path: "generate", component: import("./components/generate"), title: "Generate"}
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
