import { getCoinById } from "@/actions";
import Client from "./client";

const Page = async ({ params: { id } }: { params: { id: string } }) => {
  const { data = [], success, error } = await getCoinById(id);

  if (!success || !data) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="container pt-12 pb-24">
      <Client id={id} data={data} />
    </main>
  );
};

export default Page;
