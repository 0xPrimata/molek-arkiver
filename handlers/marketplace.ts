import { type EventHandlerFor } from "https://deno.land/x/robo_arkiver@v0.4.18/mod.ts";
import { Ask, Blacklist } from "../entities/marketplace.ts";
import { MOLEK_ABI, NFT_ABI } from "../abis/Marketplace.ts";
import { createPublicClient, getContract, http } from "npm:viem";
import { avalanche } from "npm:viem/chains";

const publicClient = createPublicClient({
  chain: avalanche,
  transport: http(),
});

export const onCreateAsk: EventHandlerFor<typeof MOLEK_ABI, "CreateAsk"> =
  async ({
    event,
    client,
  }): Promise<void> => {
    const { NFT, creator, tokenId, price } = event.args;
    const id =
      `${event.transactionHash}:${event.blockNumber}:${event.logIndex}}`;

    await Ask.deleteOne({ NFT: NFT, tokenId: Number(tokenId) });

    const record = new Ask({
      id,
      chain: await client.getChainId(),
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
    client,
  }): Promise<void> => {
    const { NFT, isBlacklisted } = event.args;
    const contract = await getContract({
      address: NFT,
      abi: NFT_ABI,
      publicClient,
    });
    const name = await contract.read.name();
    if (!isBlacklisted) {
      await Blacklist.deleteOne({ address: NFT });
    } else {
      const record = new Blacklist({
        id: `${event.transactionHash}:${event.blockNumber}:${event.logIndex}}`,
        chain: await client.getChainId(),
        address: NFT,
        collectionName: name,
      });
      await record.save();
    }
  };
