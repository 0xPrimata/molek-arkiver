import { formatUnits, getContract } from "npm:viem";
import { type EventHandlerFor } from "https://deno.land/x/robo_arkiver@v0.4.14/mod.ts";
import { Ask } from "../entities/marketplace.js";
import { MOLEK_ABI } from "../abis/Marketplace.js";

export const onCreateAsk: EventHandlerFor<typeof MOLEK_ABI, "Ask"> = async ({
  event,
  block,
}): Promise<void> => {
  const { NFT, creator, tokenId, price } = event.args;
  const id = `${event.transactionHash}:${block}:${event.transactionLogIndex}}`;
  const record = new Ask({
    id,
    NFT,
    creator,
    tokenId,
    price,
    timestamp: Number(block.timestamp),
  });
  record.save();
};

export const onCancelAsk: EventHandlerFor<typeof MOLEK_ABI, "Ask"> = async ({
  event,
  block,
  store,
}): Promise<void> => {
  const { NFT, tokenId } = event.args;
  Ask.deleteOne({ NFT: NFT, tokenId: tokenId });
};

export const onAcceptAsk: EventHandlerFor<typeof MOLEK_ABI, "Ask"> = async ({
  event,
  block,
}): Promise<void> => {
  const { NFT, tokenId, price } = event.args;
  Ask.deleteOne({ NFT: NFT, tokenId: tokenId });
};
