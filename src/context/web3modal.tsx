"use client";

import { createWeb3Modal, defaultConfig } from "@web3modal/ethers/react";
import React from "react";

// 1. Get projectId at https://cloud.walletconnect.com
export const projectId = process.env.NEXT_PUBLIC_WEB3_MODAL_PROJECT_ID || "";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: "Ethereum",
  currency: "ETH",
  explorerUrl: "https://etherscan.io",
  rpcUrl: "https://cloudflare-eth.com",
};

// 3. Create a metadata object
const metadata = {
  name: "Defi Sphere",
  description: "Defi Sphere is a decentralized finance application",
  url: "https://mywebsite.com", // origin must match your domain & subdomain
  icons: ["https://avatars.mywebsite.com/"],
};
// 4. Create Ethers config
const ethersConfig = defaultConfig({
  /*Required*/
  metadata,

  /*Optional*/
  enableEIP6963: true, // true by default
  enableInjected: true, // true by default
  enableCoinbase: true, // true by default
  rpcUrl: "...", // used for the Coinbase SDK
  defaultChainId: 1, // used for the Coinbase SDK
});

// 5. Create a Web3Modal instance
createWeb3Modal({
  ethersConfig,
  chains: [mainnet],
  projectId,
  enableOnramp: true, // Optional - false as default
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
