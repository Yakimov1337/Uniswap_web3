import { Goerli } from "@usedapp/core";

export const ROUTER_ADDRESS = process.env.NEXT_PUBLIC_ROUTER_ADDRESS; 

export const DAPP_CONFIG = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: process.env.NEXT_PUBLIC_CHAIN_ID,
  },
};