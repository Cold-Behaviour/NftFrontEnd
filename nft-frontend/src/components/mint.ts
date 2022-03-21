import { Chain } from "../services/chain";
import { inject, IRouteViewModel, Params } from "aurelia";

@inject(Chain)
export class Mint {

    tokensToMint: string = "1";
    minted: boolean = false;

    constructor(public chain: Chain) {
    }

    mint() {
        let amount: number = parseInt(this.tokensToMint);
        this.chain.mintNft(amount);
        this.chain.getData();
    }
}