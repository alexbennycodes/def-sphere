import CoinSwapForm from "@/components/coin-swap-form";
import { Card } from "@/components/ui/card";

async function listAvailableTokens() {
  let response = await fetch("https://tokens.coingecko.com/uniswap/all.json");
  let tokenListJSON = await response.json();
  const tokens = tokenListJSON.tokens;
  return tokens || [];
}

const Page = async () => {
  const tokens = await listAvailableTokens();
  return (
    <div className="container pt-24 max-w-screen-sm">
      <h1 className="text-4xl font-bold mb-10">Swap Token</h1>
      <Card className="max-w-screen-sm p-8 mx-auto">
        <CoinSwapForm tokenList={tokens} />
      </Card>
    </div>
  );
};

export default Page;
