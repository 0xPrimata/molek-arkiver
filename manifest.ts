import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.21/mod.ts";
import { MOLEK_ABI, REWARDER_ABI } from "./abis/Marketplace.ts";
import { Ask, Blacklist, Reward } from "./entities/marketplace.ts";
import {
  onAcceptAsk,
  onBlacklist,
  onCancelAsk,
  onCreateAsk,
  onRewardClaimed,
  onRewardCreated,
  onRewardToggled,
} from "./handlers/marketplace.ts";

const manifest = new Manifest("molek-asks");

manifest
  .addEntities([Ask, Blacklist])
  .addChain("avalanche", { blockRange: 100n })
  .addContract({
    name: "Molek",
    abi: MOLEK_ABI,
    sources: { "0x441d636cd482769c6581B4062e931f13aB5dA774": 33087700n },
    eventHandlers: {
      "CreateAsk": onCreateAsk,
      "CancelAsk": onCancelAsk,
      "AcceptAsk": onAcceptAsk,
      "Blacklisted": onBlacklist,
    },
  });

manifest
  .addEntities([Ask, Blacklist])
  .addChain("avalancheFuji", { blockRange: 100n })
  .addContract({
    name: "Molek",
    abi: MOLEK_ABI,
    sources: { "0xA3564C726d2F47a5cB77F4Db2272d3dc92B9Cdf6": 33087700n },
    eventHandlers: {
      "CreateAsk": onCreateAsk,
      "CancelAsk": onCancelAsk,
      "AcceptAsk": onAcceptAsk,
      "Blacklisted": onBlacklist,
    },
  });

manifest
  .addEntities([Reward])
  .addChain("avalancheFuji", { blockRange: 100n })
  .addContract({
    name: "Rewarder",
    abi: REWARDER_ABI,
    sources: { "0x2f474868E8105074366cC568D6E6fC9438bf9508": 25388350n },
    eventHandlers: {
      "RewardCreated": onRewardCreated,
      "RewardToggled": onRewardToggled,
      "RewardClaimed": onRewardClaimed,
    },
  });

export default manifest
  .build();
