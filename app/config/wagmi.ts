import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { createConfig, fallback, http } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";

const transports = {
  [mainnet.id]: fallback([http()]),
  [sepolia.id]: fallback([
    http("https://sepolia.infura.io/v3/{your-key}"),
    http(),
  ]),
};

function getChainsPerEnv(envChainId: number) {
  switch (envChainId) {
    case mainnet.id:
      return [mainnet] as const;
    case sepolia.id:
      return [sepolia, mainnet] as const;
    default:
      return [mainnet] as const;
  }
}

const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [
        metaMaskWallet,
        rabbyWallet,
        injectedWallet,
        coinbaseWallet,
        rainbowWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: "Test PWA",
    projectId: "{your-project-id}",
  }
);

export const config = createConfig({
  ssr: true,
  connectors,
  chains: getChainsPerEnv(sepolia.id),
  transports: transports,
});
