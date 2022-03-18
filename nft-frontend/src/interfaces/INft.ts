import { IAttribute } from "./IAttribute";

export interface INft {
    attributes: IAttribute[];
    description: string;
    image: string;
    name: string;
    tokenId: number;
}