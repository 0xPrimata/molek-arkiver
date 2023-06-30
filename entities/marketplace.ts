import { createEntity } from '../deps.js'

export interface ICreateAsk {
  NFT: string
  creator: string
  tokenId: number
  price: number
  block: number
  timestamp: number
}

export const CreateAsk = createEntity<ICreateAsk>('CreateAsk', {
  NFT: String,
  creator: String,
  tokenId: { type: Number, index: true },
  price: { type: Number, index: true },
  timestamp: { type: Number, index: true },
})

export const CancelAsk = createEntity<ICreateAsk>('CancelAsk', {
  NFT: String,
  tokenId: { type: Number, index: true },
  timestamp: { type: Number, index: true },
})

export const AcceptAsk = createEntity<ICreateAsk>('AcceptAsk', {
  NFT: String,
  tokenId: { type: Number, index: true },
  price: { type: Number, index: true },
  timestamp: { type: Number, index: true },
})