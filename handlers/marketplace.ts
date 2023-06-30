import { formatUnits, getContract } from "npm:viem";
import { type EventHandlerFor } from "https://deno.land/x/robo_arkiver@v0.4.14/mod.ts";
import { AcceptAsk, CancelAsk, CreateAsk } from "../entities/marketplace.js";
import { MOLEK_ABI } from "../abis/Marketplace.js";

export const MOLEK = [
  { address: "0xB9606333AE6DD0B8C5ddd4FF19f55F4eF7FDC7D1", block: 23621821 }, // MOLEK
] as const;

export const onCreateAsk: EventHandlerFor<typeof MOLEK_ABI, "CreateAsk"> =
  async ({
    event,
    block,
  }): Promise<void> => {
    const { NFT, creator, tokenId, price } = event.args;
    const id =
      `${event.transactionHash}:${block}:${event.transactionLogIndex}}`;
    const record = new CreateAsk({
      id,
      NFT,
      creator,
      tokenId,
      price,
      timestamp: Number(block.timestamp),
    });
    record.save();
  };

export const onCancelAsk: EventHandlerFor<typeof MOLEK_ABI, "CancelAsk"> =
  async ({
    event,
    block,
    store,
  }): Promise<void> => {
    const { NFT, tokenId } = event.args;
    CreateAsk.deleteOne({ NFT: NFT, tokenId: tokenId });
  };

export const onAcceptAsk: EventHandlerFor<typeof MOLEK_ABI, "AcceptAsk"> =
  async ({
    event,
    block,
  }): Promise<void> => {
    const { NFT, tokenId, price } = event.args;
    CreateAsk.deleteOne({ NFT: NFT, tokenId: tokenId });
  };
