"use client";

import Link from "next/link";
import { CarIcon } from "lucide-react";
import { Button } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

const Header = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 lg:px-8">
      <header className="flex h-20 w-full shrink-0 items-center px-4 md:px-6">
        <Link href="#" className="mr-6 hidden lg:flex" prefetch={false}>
          <CarIcon className="h-6 w-6" />
          <span className="sr-only">LL</span>
        </Link>
        <div className="ml-auto flex gap-2">
          <Button asChild variant="outline">
            <Link href="/" prefetch={false}>
              Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/setting" prefetch={false}>
              Setting
            </Link>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              window.open("https://github.com/jochristianto/next-ll");
            }}
          >
            <GitHubLogoIcon className="size-4" />
          </Button>
        </div>
      </header>
    </div>
  );
};

export default Header;
