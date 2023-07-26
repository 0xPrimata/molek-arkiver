import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.18/mod.ts";
import { MOLEK_ABI } from "./abis/Marketplace.ts";
import { Ask, Blacklist } from "./entities/marketplace.ts";
import {
  onAcceptAsk,
  onBlacklist,
  onCancelAsk,
  onCreateAsk,
} from "./handlers/marketplace.ts";

const manifest = new Manifest("molek-asks");

manifest
  .addEntities([Ask, Blacklist])
  .addChain("avalanche", { blockRange: 100n })
  .addContract(MOLEK_ABI)
  .addSources({ "0x441d636cd482769c6581B4062e931f13aB5dA774": 33087700n })
  .addEventHandlers({ "CreateAsk": onCreateAsk })
  .addEventHandlers({ "CancelAsk": onCancelAsk })
  .addEventHandlers({ "AcceptAsk": onAcceptAsk })
  .addEventHandlers({ "Blacklisted": onBlacklist });

export default manifest
  .build();
