import { getCoinsList } from "@/actions/coin";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CoinType } from "@/types/coin";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const { data = [], success, error } = await getCoinsList();

  if (!success || !data) {
    return <div>Error: {error}</div>;
  }

  return (
    <main className="flex flex-col items-center justify-between py-24">
      <div className="container w-full">
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Cryptocurrency Prices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Market Cap</TableHead>

                  <TableHead className="hidden md:table-cell">
                    Total Volume
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    High (24h)
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Low (24h)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((coin: CoinType) => (
                  <TableRow key={coin.id}>
                    <TableCell className="font-medium text-lg">
                      <Link
                        href={`/currencies/${coin.id}`}
                        className="flex items-center gap-2"
                      >
                        <Image
                          alt="Coin image"
                          className="aspect-square rounded-md object-cover"
                          height="32"
                          src={coin.image}
                          width="32"
                        />
                        {coin.name}

                        <span className="text-xs text-muted-foreground uppercase">
                          {coin.symbol}
                        </span>
                      </Link>
                    </TableCell>

                    <TableCell>
                      ${coin.current_price.toLocaleString()}
                    </TableCell>
                    <TableCell>${coin.market_cap.toLocaleString()}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${coin.total_volume.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${coin.high_24h.toLocaleString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      ${coin.low_24h.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
