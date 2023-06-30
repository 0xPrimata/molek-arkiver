import { createEntity } from "../deps.js";

export interface IAsk {
  NFT: string;
  creator: string;
  tokenId: number;
  price: number;
  timestamp: number;
}

export const Ask = createEntity<IAsk>("Ask", {
  NFT: { type: String, index: true },
  creator: String,
  tokenId: { type: Number, index: true },
  price: { type: Number, index: false },
  timestamp: { type: Number, index: true },
});
