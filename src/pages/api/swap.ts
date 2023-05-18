import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

const qs = require("qs");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { state, message } = req.body;
  const { query } = req;

  // const params = {
  //   // Not all token symbols are supported. The address of the token can be used instead.
  //   sellToken: "WETH",
  //   buyToken: "UNI",
  //   // Note that the DAI token uses 18 decimal places, so `sellAmount` is `5 * 10^18`.
  //   sellAmount: ((5 * 10) ^ 18).toString(),
  //   takerAddress: query.address,
  // };

  const headers = {
    "0x-api-key": process.env.NEXT_PUBLIC_ZEROX_API_KEY || "",
  }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

  try {
    const response = await axios.get(
      `https://goerli.api.0x.org/swap/v1/quote?${qs.stringify(query)}`,
      {
        headers,
      }
    ); // Using the global fetch() method. Learn more https://developer.mozilla.org/en-US/docs/Web/API/fetch

    res.status(200).json({});
  } catch (error) {
    console.log(error?.response?.data);

    res.status(500).json(error);
  }
}

export async function getQuote({ account, selectedAmount, currentTrade }: any) {
  console.log("Getting Quote");

  if (!currentTrade.from || !currentTrade.to) return;

  let amount = Number(selectedAmount * 10 ** currentTrade.from.decimals);

  const params = {
    sellToken: currentTrade.from.address,
    buyToken: currentTrade.to.address,
    sellAmount: amount,
    takerAddress: account,
  };

  const headers = { "0x-api-key": process.env.ZEROX_API_KEY || "" }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

  // Fetch the swap quote.
  const response = await fetch(
    `https://api.0x.org/swap/v1/quote?${qs.stringify(params)}`,
    { headers }
  );

  const swapQuoteJSON = await response.json();
  console.log("Quote: ", swapQuoteJSON);

  return swapQuoteJSON;
}
