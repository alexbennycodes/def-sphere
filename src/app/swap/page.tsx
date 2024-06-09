import { getSwapCoinList } from "@/actions/swap";
import CoinSwapForm from "@/components/coin-swap-form";
import { Card } from "@/components/ui/card";

const Page = async () => {
  const { data = [], success, error } = await getSwapCoinList();
  if (!success || !data) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="container pt-24 max-w-screen-sm">
      <h1 className="text-4xl font-bold mb-10">Swap Token</h1>
      <Card className="max-w-screen-sm p-8 mx-auto">
        <CoinSwapForm tokenList={data} />
      </Card>
    </div>
  );
};

export default Page;
