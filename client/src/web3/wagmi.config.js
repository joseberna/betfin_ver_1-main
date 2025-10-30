import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { metaMask } from "wagmi/connectors";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [
    metaMask({
      infuraAPIKey: process.env.REACT_APP_RPC_SEPOLIA, 
    }),
  ],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage, 
  }),
  transports: {    
    [sepolia.id]: http(process.env.REACT_APP_RPC_SEPOLIA),
  },
});
