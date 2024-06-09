import Link from "next/link";
import { Icons } from "@/components/shared/icons";
import ThemeToggle from "@/components/shared/theme-toggle";
import UserNav from "@/components/user-nav";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-30 border-b bg-background/60 px-4 backdrop-blur-xl transition-all py-4">
      <div className="container flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.logo className="h-7 w-7 text-primary" />
          <span className="inline-block text-xl font-medium whitespace-nowrap">
            Defi Sphere
          </span>
        </Link>

        <div className="ml-auto flex items-center space-x-4">
          <Link
            href="/currencies"
            className="text-sm font-medium hover:text-primary"
          >
            Coin Tracker
          </Link>
          <Link href="/swap" className="text-sm font-medium hover:text-primary">
            Swap token
          </Link>
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
