"use client";

import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { LoginMenu } from "./users/LoginMenu";
import { ProfileMenu } from "./users/ProfileMenu";
import NotificationComponent from "./Notifications";
import { WasteWithAuctionForm } from "./register/waste&auction";

export default function Header() {
  const { status } = useSession();
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const router = useRouter();
  const path = usePathname();

  const loggedIn = status === "authenticated";

  const checkIfPath = (pathStr: string) => {
    return path === pathStr;
  };

  const goto = (pathStr: string) => {
    router.push(pathStr);
  };

  const navButtons = [
    ["/", "Inicio"],
    ["/manage/wastes", "Mis residuos"],
    ["/search/auctions", "Comprar"],
  ];

  return (
    <div className="flex w-full flex-col shadow-md">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="text-nowrap hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          {navButtons.map((btn, idx) => (
            <Button
              key={idx}
              variant={"link"}
              onClick={() => goto(btn[0])}
              disabled={checkIfPath(btn[0])}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {btn[1]}
            </Button>
          ))}
          <WasteWithAuctionForm/>
        </nav>
        <Sheet open={sideMenuOpen} onOpenChange={setSideMenuOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col gap-4 w-fit">
            <SheetTitle>Menú</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation menu
            </SheetDescription>
            <nav className="grid gap-6 w-fit pr-16 text-lg font-medium">
              {navButtons.map((btn, idx) => (
                <Button
                  key={idx}
                  variant={"ghost"}
                  onClick={() => {
                    goto(btn[0]);
                    setSideMenuOpen(false);
                  }}
                  disabled={checkIfPath(btn[0])}
                  className="text-muted-foreground justify-start transition-colors hover:text-foreground"
                >
                  {btn[1]}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
          <div className="ml-auto flex-1 sm:flex-initial"></div>
          <NotificationComponent></NotificationComponent>
          {/* <NotificationComponent /> */}
          {loggedIn ? <ProfileMenu /> : <LoginMenu />}
        </div>
      </header>
    </div>
  );
}
