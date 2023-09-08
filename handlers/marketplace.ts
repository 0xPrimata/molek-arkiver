import { type EventHandlerFor } from "https://deno.land/x/robo_arkiver@v0.4.21/mod.ts";
import { Ask, Blacklist, Reward } from "../entities/marketplace.ts";
import { MOLEK_ABI, NFT_ABI, REWARDER_ABI } from "../abis/Marketplace.ts";
import { createPublicClient, getContract, http } from "npm:viem";
import { avalanche, avalancheFuji } from "npm:viem/chains";
import { formatUnits } from "npm:viem";

const publicClient = createPublicClient({
  chain: avalanche,
  transport: http(),
});

export const molekAddress = "0x441d636cd482769c6581B4062e931f13aB5dA774";
export const rewarderAddress = "0x6D36bD903fEbdd9eA9B75502aFe451E7D9e5EF65";

const formatBigIntArray = (array: readonly bigint[]) => {
  return array.length == 0 ? [] : array.map((value) => formatUnits(value, 0));
};

const formatBigInt = (value: bigint) => {
  return formatUnits(value, 0);
};

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

export const onRewardCreated: EventHandlerFor<
  typeof REWARDER_ABI,
  "RewardCreated"
> = async ({
  event,
  client,
}): Promise<void> => {
  const {
    id,
    title,
    collection,
    category,
    globalLimit,
    walletLimit,
    amountPerFavor,
  } = event.args;
  const contract = await getContract({
    address: rewarderAddress,
    abi: REWARDER_ABI,
    publicClient,
  });

  const rewardData = await contract.read.getRewardData([id]);
  const tokenIds = rewardData[1];
  const record = new Reward({
    chain: await client.getChainId(),
    rewardId: Number(formatUnits(id, 0)),
    title: title,
    collectionAddress: collection,
    paused: false,
    category: category,
    globalLimit: formatBigInt(globalLimit),
    walletLimit: formatBigInt(walletLimit),
    amountPerFavor: formatBigInt(amountPerFavor),
    claimed: 0,
    tokenIds: formatBigIntArray(tokenIds),
  });
  await record.save();
};

export const onRewardToggled: EventHandlerFor<
  typeof REWARDER_ABI,
  "RewardToggled"
> = async ({
  event,
  client,
  store,
}): Promise<void> => {
  const {
    id,
    paused,
  } = event.args;
  const contract = await getContract({
    address: rewarderAddress,
    abi: REWARDER_ABI,
    publicClient,
  });

  await Reward.deleteOne({
    chain: await client.getChainId(),
    rewardId: Number(formatUnits(id, 0)),
  });

  const rewardData = await contract.read.getRewardData([id]);
  const tokenIds = rewardData[1];

  const record = new Reward({
    chain: await client.getChainId(),
    rewardId: Number(formatUnits(id, 0)),
    title: rewardData[0].title,
    collectionAddress: rewardData[0].collection,
    paused: paused,
    category: rewardData[0].category,
    globalLimit: formatBigInt(rewardData[0].globalLimit),
    walletLimit: formatBigInt(rewardData[0].walletLimit),
    amountPerFavor: formatBigInt(rewardData[0].amountPerFavor),
    claimed: formatBigInt(rewardData[0].claimed),
    tokenIds: formatBigIntArray(tokenIds),
  });

  await record.save();
};

export const onRewardClaimed: EventHandlerFor<
  typeof REWARDER_ABI,
  "RewardClaimed"
> = async ({
  event,
  client,
  store,
}): Promise<void> => {
  const {
    id,
    wallet,
    amount,
    signature,
  } = event.args;
  const contract = await getContract({
    address: rewarderAddress,
    abi: REWARDER_ABI,
    publicClient,
  });

  await Reward.deleteOne({
    chain: await client.getChainId(),
    rewardId: Number(formatUnits(id, 0)),
  });

  const rewardData = await contract.read.getRewardData([id]);

  const record = new Reward({
    chain: await client.getChainId(),
    rewardId: Number(formatUnits(id, 0)),
    title: rewardData[0].title,
    collectionAddress: rewardData[0].collection,
    paused: false,
    category: rewardData[0].category,
    globalLimit: formatBigInt(rewardData[0].globalLimit),
    walletLimit: formatBigInt(rewardData[0].walletLimit),
    amountPerFavor: formatBigInt(rewardData[0].amountPerFavor),
    claimed: formatBigInt(rewardData[0].claimed + amount),
    tokenIds: formatBigIntArray(rewardData[1]),
  });

  await record.save();
};
