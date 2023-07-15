import { type EventHandlerFor } from "https://deno.land/x/robo_arkiver@v0.4.17/mod.ts";
import { Ask, Blacklist } from "../entities/marketplace.ts";
import { MOLEK_ABI } from "../abis/Marketplace.ts";

export const onCreateAsk: EventHandlerFor<typeof MOLEK_ABI, "CreateAsk"> =
  async ({
    event,
  }): Promise<void> => {
    const { NFT, creator, tokenId, price } = event.args;
    const id =
      `${event.transactionHash}:${event.blockNumber}:${event.logIndex}}`;

    await Ask.deleteOne({ NFT: NFT, tokenId: Number(tokenId) });

    const record = new Ask({
      id,
      NFT,
      creator,
      tokenId: Number(tokenId),
      price: Number(price),
    });

    await record.save();
  };

export const onCancelAsk: EventHandlerFor<typeof MOLEK_ABI, "CancelAsk"> =
  async ({
    event,
    store,
  }): Promise<void> => {
    const { NFT, tokenId } = event.args;
    await Ask.deleteOne({ NFT: NFT, tokenId: Number(tokenId) });
  };

export const onAcceptAsk: EventHandlerFor<typeof MOLEK_ABI, "AcceptAsk"> =
  async ({
    event,
  }): Promise<void> => {
    const { NFT, tokenId, price } = event.args;
    await Ask.deleteOne({ NFT: NFT, tokenId: Number(tokenId) });
  };

export const onBlacklist: EventHandlerFor<typeof MOLEK_ABI, "Blacklisted"> =
  async ({
    event,
  }): Promise<void> => {
    const { NFT, isBlacklisted } = event.args;
    if (!isBlacklisted) {
      await Blacklist.deleteOne({ address: NFT });
    } else {
      const record = new Blacklist({
        id: `${event.transactionHash}:${event.blockNumber}:${event.logIndex}}`,
        address: NFT,
      });
      await record.save();
    }
  };
