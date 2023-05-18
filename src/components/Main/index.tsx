import { useState, useEffect, useRef } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { IBalances } from "@biconomy/node-client";
import { ethers } from "ethers";
import SmartAccount from "@biconomy/smart-account";
import useBalance from "@/hooks/useBalance";

import SwapForm from "../SwapForm";
import Header from "../Header";

const Main = () => {
  const [smartAccount, setSmartAccount] = useState<SmartAccount | null>(null);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [balance, setBalance] = useState<any>();

  const [getBalance] = useBalance();

  useEffect(() => {
    let configureLogin: any;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
      const signature1 = await socialLoginSDK.whitelistUrl(
        "https://blaze-puce.vercel.app"
      );
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.GOERLI),
        whitelistUrls: {
          "https://blaze-puce.vercel.app": signature1,
        },
      });
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current.provider) {
      // sdkRef.current.showConnectModal()
      sdkRef.current.showWallet();
      enableInterval(true);
    } else {
      setupSmartAccount();
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    );
    try {
      const smartAccount = new SmartAccount(web3Provider, {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [ChainId.GOERLI],
        networkConfig: [
          {
            chainId: ChainId.GOERLI,
            dappAPIKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY,
          },
        ],
      });
      await smartAccount.init();

      setSmartAccount(smartAccount);
      setLoading(false);

      const response = await getBalance(smartAccount);
      const { data = [] } = response || {};

      setBalance(data);
    } catch (err) {
      console.log("error setting up smart account... ", err);
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    setSmartAccount(null);
    enableInterval(false);
  };

  return (
    <div className="App bg-gray-50 min-h-screen flex flex-col items-center py-12">
      <Header
        loading={loading}
        smartAccount={smartAccount}
        connectWallet={login}
        logout={logout}
      />
      <main className="flex flex-col items-center mt-24 w-11/12 sm:w-1/2 md:w-1/3 lg:w-1/4">
        {loading && <p>Loading account details...</p>}
        {!!smartAccount && (
          <div>
            <SwapForm smartAccount={smartAccount} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Main;
