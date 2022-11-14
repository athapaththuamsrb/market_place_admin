import * as React from "react";
import { useEffect } from "react";
import Head from "next/head";
import NextHead from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import theme from "../src/theme";
import createEmotionCache from "../src/createEmotionCache";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/900.css";

//Wagmi imports
import {
  WagmiConfig,
  createClient,
  defaultChains,
  configureChains,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import Layout from "../components/layout";
import { InjectedConnector } from "wagmi/connectors/injected";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

//Wagmi connect
const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID;

const { chains, provider, webSocketProvider } = configureChains(defaultChains, [
  publicProvider(),
]);

//Create client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      options: {
        qrcode: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});
if (typeof window !== "undefined") {
  console.log("You are on the browser");
  window.Buffer = window.Buffer || require("buffer").Buffer;
} else {
  console.log("You are on the server");
}

export default function MyApp(props: { Component: any; emotionCache?: EmotionCache | undefined; pageProps: any; }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("service worker registered", reg))
        .catch((err) => console.log("service worker not registered", err));
    }
  }, []);
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <WagmiConfig client={client}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>Exclusives</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
        </ThemeProvider>
      </CacheProvider>
    </WagmiConfig>
  );
}
