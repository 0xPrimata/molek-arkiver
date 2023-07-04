import { Manifest } from "https://deno.land/x/robo_arkiver@v0.4.14/mod.ts";
import { MOLEK_ABI } from "./abis/Marketplace.ts";
import { Ask } from "./entities/marketplace.ts";
import {
  onAcceptAsk,
  onCancelAsk,
  onCreateAsk,
} from "./handlers/marketplace.ts";

const manifest = new Manifest("molek-asks");

manifest
  .addEntity(Ask)
  .chain("avalancheFuji", { blockRange: 100n })
  .contract(MOLEK_ABI)
  .addSources({ "0xb9606333ae6dd0b8c5ddd4ff19f55f4ef7fdc7d1": 23767800n })
  .addEventHandlers({ "CreateAsk": onCreateAsk })
  .addEventHandlers({ "CancelAsk": onCancelAsk })
  .addEventHandlers({ "AcceptAsk": onAcceptAsk });

export default manifest
  .build();
