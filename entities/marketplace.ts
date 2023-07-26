import { createEntity } from "../deps.ts";

export interface IAsk {
  id: string;
  chain: number;
  NFT: string;
  creator: string;
  tokenId: number;
  price: number;
}

export interface IBlacklist {
  id: string;
  chain: number;
  address: string;
  collectionName: string;
}

export const Ask = createEntity<IAsk>("Ask", {
  id: String,
  chain: { type: Number, index: true },
  NFT: { type: String, index: true },
  creator: String,
  tokenId: { type: Number, index: true },
  price: { type: Number, index: false },
});

export const Blacklist = createEntity<IBlacklist>("Blacklist", {
  id: String,
  chain: { type: Number, index: true },
  address: { type: String, index: true },
  collectionName: String,
});
