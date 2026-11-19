import { GAMES, getGame, getGameProduct, gameMinPrice } from "./games";
import { PPOB, getPpob, getPpobProduct } from "./ppob";
import type { Service, ServiceKind } from "@/types";

export { GAMES, getGame, getGameProduct, gameMinPrice };
export { PPOB, getPpob, getPpobProduct };

export function getService(kind: ServiceKind, id: string): Service | null {
  return kind === "game" ? getGame(id) : getPpob(id);
}

export function getProduct(kind: ServiceKind, svcId: string, pid: string) {
  return kind === "game" ? getGameProduct(svcId, pid) : getPpobProduct(svcId, pid);
}
