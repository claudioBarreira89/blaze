import { ChainId } from "@biconomy/core-types";
import SmartAccount from "@biconomy/smart-account";

const useBalance = () => {
  async function getBalance(smartAccount: SmartAccount) {
    if (!smartAccount) return;
    console.log("smartAccount: ", smartAccount);

    /* this function fetches the balance of the connected smart wallet */
    const balanceParams = {
      chainId: ChainId.GOERLI,
      eoaAddress: smartAccount.address,
      tokenAddresses: [],
    };

    /* use getAlltokenBalances and getTotalBalanceInUsd query the smartAccount */
    const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams);
    console.log("balFromSdk::: ", balFromSdk);

    const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(
      balanceParams
    );
    console.log("usdBalFromSdk: ", usdBalFromSdk);

    return balFromSdk;
  }

  return [getBalance];
};

export default useBalance;
