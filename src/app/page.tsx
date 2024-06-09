import Link from "next/link";

export default async function Home() {
  return (
    <section className="relative">
      <div className="flex flex-col items-center justify-center container max-w-5xl overflow-x-hidden py-48 max-w-screen">
        <div className="w-full duration-1000 animate-in fade-in-10 slide-in-from-bottom-10">
          <h1 className="text-7xl lg:text-[95px] font-title-light-italic tracking-tight font-light">
            Defi Sphere
          </h1>

          <p className="mt-5 lg:mt-12 lg:text-xl text-gray-200/60 font-medium lg:tracking-wider text-balance">
            Defi Sphere is a decentralized finance application. Connect your
            wallet to start using Defi Sphere. Token swaps, lending, borrowing,
            and more. Real-time market data, analytics, and more.
          </p>
          <Link
            href="/swap"
            className="relative text-sm lg:text-base inline-flex h-10 lg:h-12 items-center justify-center bg-primary px-6 font-medium text-white transition-colors focus:outline-none focus:ring-0 mt-10 rounded-full group/button"
          >
            <div className="absolute -inset-0.5 -z-10 rounded-full bg-gradient-to-b from-primary to-primary/80 opacity-75 blur group-hover/button:opacity-100 group-hover/button:blur-md transition-all duration-200 ease-in-out" />
            Swap Token
          </Link>
        </div>
      </div>
    </section>
  );
}
