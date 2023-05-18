export async function listAvailableTokens() {
  let response = await fetch("https://tokens.coingecko.com/uniswap/all.json");
  let tokenListJSON = await response.json();

  const tokens = tokenListJSON.tokens;

  return tokens;
}
