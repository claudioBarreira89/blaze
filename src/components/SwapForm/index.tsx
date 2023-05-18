import { listAvailableTokens } from "@/services";
import { useEffect, useState } from "react";
import Web3 from "web3";

const qs = require("qs");

interface IToken {
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
  name: string;
  symbol: string;
}

const SwapForm: React.FC<any> = ({ smartAccount }) => {
  const [tokens, setTokens] = useState<IToken[]>([]);

  const [makerToken, setMakerToken] = useState<string>("");
  const [takerToken, setTakerToken] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  const fetchTokens = async () => {
    const response = await listAvailableTokens();
    setTokens(
      response.filter(
        ({ address }: any) =>
          address === "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2" ||
          address == "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      )
    );
  };

  useEffect(() => {
    fetchTokens();
  }, []);

  const handleSwap = async (event: any) => {
    event.preventDefault();

    const headers = {
      "0x-api-key": process.env.NEXT_PUBLIC_ZEROX_API_KEY || "",
    };

    console.log(headers);

    const response = await fetch(
      `https://goerli.api.0x.org/swap/v1/quote?sellToken=${
        "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6" || makerToken
      }&buyToken=${
        "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984" || takerToken
      }&sellAmount=${Number(amount) * 10 ** 18}`
    );
    const quote = await response.json();

    const tx = {
      from: smartAccount.address,
      to: quote.to,
      data: quote.data,
      value: quote.value,
      gasPrice: quote.gasPrice,
      gas: quote.estimatedGas,
    };
    console.log(quote);
    const txResponse = await smartAccount.sendTransaction({ transaction: tx });

    console.log(txResponse);
    const txHash = await txResponse.wait();
    console.log(txHash);
  };

  return (
    <form
      onSubmit={handleSwap}
      className="flex flex-col items-center bg-white p-8 shadow-lg rounded-lg w-full"
    >
      <h2 className="text-2xl mb-6 text-center">Swap Tokens</h2>

      <div className="w-full mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Sell Token:
        </label>
        <select
          onChange={(e) => setMakerToken(e.target.value)}
          className="w-full px-3 py-2 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {tokens.map((token, index) => (
            <option value={token.address} key={index}>
              {token.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Buy Token:
        </label>
        <select
          onChange={(e) => setTakerToken(e.target.value)}
          className="w-full px-3 py-2 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          {tokens.map((token, index) => (
            <option value={token.address} key={index}>
              {token.name}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full mb-6">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Amount to Sell:
        </label>
        <input
          type="number"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Swap
      </button>
    </form>
  );
};

export default SwapForm;
