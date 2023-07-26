import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.17/mod.ts";
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

manifest
  .addEntities([Ask, Blacklist])
  .addChain("avalancheFuji", { blockRange: 100n })
  .addContract(MOLEK_ABI)
  .addSources({ "0xec0c9bC9db97D5A33157bc0F2feA44DfDc65dEED": 24178000n })
  .addEventHandlers({ "CreateAsk": onCreateAsk })
  .addEventHandlers({ "CancelAsk": onCancelAsk })
  .addEventHandlers({ "AcceptAsk": onAcceptAsk })
  .addEventHandlers({ "Blacklisted": onBlacklist });

export default manifest
  .build();
