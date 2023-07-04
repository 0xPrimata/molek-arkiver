import { createEntity } from "../deps.ts";

export interface IAsk {
  id: string;
  NFT: string;
  creator: string;
  tokenId: number;
  price: number;
}

export const Ask = createEntity<IAsk>("Ask", {
  id: String,
  NFT: { type: String, index: true },
  creator: String,
  tokenId: { type: Number, index: true },
  price: { type: Number, index: false },
});
